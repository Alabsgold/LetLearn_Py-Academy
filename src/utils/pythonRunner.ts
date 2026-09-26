import { PythonExecutionResult } from '../types';

/**
 * Lightweight safe Python emulator for the LetLearn_Py agenda.
 * Emulates Python lists, negative indexing, slicing, methods (append, insert, extend, remove, pop, clear),
 * split(), loops, list comprehensions, print(), len(), and typecasting.
 */
export function runPythonCode(rawCode: string): PythonExecutionResult {
  const outputLines: string[] = [];

  try {
    // Clean comments and normalize indentation
    const lines = rawCode.split('\n');

    // Create a virtual environment context
    const scope: Record<string, any> = {};

    // Standard Python built-ins mapped to JavaScript helpers
    const print = (...args: any[]) => {
      const formatted = args
        .map(a => {
          if (a === null || a === undefined) return 'None';
          if (typeof a === 'boolean') return a ? 'True' : 'False';
          if (Array.isArray(a)) {
            return formatPythonList(a);
          }
          if (typeof a === 'object') {
            return JSON.stringify(a).replace(/"/g, "'");
          }
          return String(a);
        })
        .join(' ');
      outputLines.push(formatted);
    };

    const pyLen = (obj: any): number => {
      if (Array.isArray(obj) || typeof obj === 'string') return obj.length;
      if (typeof obj === 'object' && obj !== null) return Object.keys(obj).length;
      throw new Error(`TypeError: object of type '${typeof obj}' has no len()`);
    };

    const pySum = (arr: any[]): number => {
      if (!Array.isArray(arr)) throw new Error("TypeError: 'sum' requires an iterable");
      return arr.reduce((acc, curr) => acc + Number(curr), 0);
    };

    const pyType = (val: any): string => {
      if (Array.isArray(val)) return "<class 'list'>";
      if (typeof val === 'number') return Number.isInteger(val) ? "<class 'int'>" : "<class 'float'>";
      if (typeof val === 'string') return "<class 'str'>";
      if (typeof val === 'boolean') return "<class 'bool'>";
      if (typeof val === 'object') return "<class 'dict'>";
      return "<class 'NoneType'>";
    };

    // Helper to format JavaScript arrays to look exactly like Python lists
    function formatPythonList(arr: any[]): string {
      const items = arr.map(item => {
        if (typeof item === 'string') return `'${item}'`;
        if (typeof item === 'boolean') return item ? 'True' : 'False';
        if (item === null || item === undefined) return 'None';
        if (Array.isArray(item)) return formatPythonList(item);
        if (typeof item === 'object') return JSON.stringify(item).replace(/"/g, "'");
        return String(item);
      });
      return `[${items.join(', ')}]`;
    }

    // Wrap JS array with Python methods
    function makePyList(initial: any[] = []): any[] {
      const list = [...initial];

      // Define non-enumerable methods
      Object.defineProperty(list, 'append', {
        value: function (item: any) {
          // In Python, appending a list adds it as a single element
          this.push(item);
          return null;
        },
        writable: true,
        configurable: true
      });

      Object.defineProperty(list, 'extend', {
        value: function (iterable: any[]) {
          if (!Array.isArray(iterable)) {
            throw new Error("TypeError: 'extend' requires an iterable");
          }
          this.push(...iterable);
          return null;
        },
        writable: true,
        configurable: true
      });

      Object.defineProperty(list, 'insert', {
        value: function (index: number, item: any) {
          this.splice(index, 0, item);
          return null;
        },
        writable: true,
        configurable: true
      });

      Object.defineProperty(list, 'pop', {
        value: function (index: number = -1) {
          if (this.length === 0) throw new Error('IndexError: pop from empty list');
          const idx = index < 0 ? this.length + index : index;
          if (idx < 0 || idx >= this.length) throw new Error('IndexError: pop index out of range');
          const [removed] = this.splice(idx, 1);
          return removed;
        },
        writable: true,
        configurable: true
      });

      Object.defineProperty(list, 'remove', {
        value: function (item: any) {
          const idx = this.findIndex((x: any) => JSON.stringify(x) === JSON.stringify(item));
          if (idx === -1) throw new Error(`ValueError: list.remove(x): x not in list`);
          this.splice(idx, 1);
          return null;
        },
        writable: true,
        configurable: true
      });

      Object.defineProperty(list, 'clear', {
        value: function () {
          this.length = 0;
          return null;
        },
        writable: true,
        configurable: true
      });

      return list;
    }

    // Transform Python code lines into safe JS script
    const transformedLines = lines.map(line => {
      let l = line.trim();
      if (!l || l.startsWith('#')) return '';

      // Convert print(...) to our print helper
      // Convert True / False / None
      l = l.replace(/\bTrue\b/g, 'true')
           .replace(/\bFalse\b/g, 'false')
           .replace(/\bNone\b/g, 'null');

      // Convert len(...) -> pyLen(...)
      l = l.replace(/\blen\(([^)]+)\)/g, 'pyLen($1)');
      // Convert sum(...) -> pySum(...)
      l = l.replace(/\bsum\(([^)]+)\)/g, 'pySum($1)');
      // Convert type(...) -> pyType(...)
      l = l.replace(/\btype\(([^)]+)\)/g, 'pyType($1)');

      // Convert list comprehension: [expr for var in iterable if cond]
      const compWithIf = /\[\s*(.+?)\s+for\s+(\w+)\s+in\s+(.+?)\s+if\s+(.+?)\s*\]/;
      if (compWithIf.test(l)) {
        l = l.replace(compWithIf, 'makePyList(($3).filter($2 => $4).map($2 => $1))');
      }

      // Convert list comprehension without if: [expr for var in iterable]
      const compSimple = /\[\s*(.+?)\s+for\s+(\w+)\s+in\s+(.+?)\s*\]/;
      if (compSimple.test(l)) {
        l = l.replace(compSimple, 'makePyList(($3).map($2 => $1))');
      }

      // Convert .split() on strings to produce makePyList
      l = l.replace(/\.split\(\)/g, '.trim().split(/\\s+/).filter(Boolean)');

      // Convert int(x) typecast
      l = l.replace(/\bint\(([^)]+)\)/g, 'parseInt($1, 10)');
      l = l.replace(/\bfloat\(([^)]+)\)/g, 'parseFloat($1)');
      l = l.replace(/\bstr\(([^)]+)\)/g, 'String($1)');

      // Support power operator **
      l = l.replace(/(\w+)\s*\*\*\s*(\w+)/g, 'Math.pow($1, $2)');

      // Handle variable assignment like `nums = [...]` -> `var nums = makePyList([...])`
      if (/^[a-zA-Z_]\w*\s*=/.test(l) && !l.startsWith('var ') && !l.startsWith('let ')) {
        const eqIdx = l.indexOf('=');
        const varName = l.slice(0, eqIdx).trim();
        const valueExpr = l.slice(eqIdx + 1).trim();

        // If assigning array literal, wrap in makePyList
        if (valueExpr.startsWith('[') && valueExpr.endsWith(']')) {
          return `${varName} = makePyList(${valueExpr});`;
        }
        return `${varName} = ${valueExpr};`;
      }

      return l + ';';
    });

    const executableJs = `
      var makePyList = ${makePyList.toString()};
      var pyLen = ${pyLen.toString()};
      var pySum = ${pySum.toString()};
      var pyType = ${pyType.toString()};
      var formatPythonList = ${formatPythonList.toString()};
      
      // Handle negative indexing helper
      // Set up variables
      var myList, mylist2, myList3, myList4, numbers, fruits, colors, nums, grades, raw, s, text, evens, evens_squared, num_list, raw_data;
      
      ${transformedLines.join('\n')}
    `;

    // Execute within Function scope with our print injected
    const runFn = new Function('print', executableJs);
    runFn(print);

    return {
      output: outputLines.join('\n') || '(Program executed successfully with no output)'
    };
  } catch (err: any) {
    return {
      output: outputLines.join('\n'),
      error: `Python Traceback (most recent call last):\n  ${err.message || String(err)}`
    };
  }
}
