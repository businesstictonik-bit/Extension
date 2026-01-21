(function (Scratch) {
  'use strict';

  class ListToJS {
    getInfo() {
      return {
        id: 'listtojs',
        name: 'List to JS',
        color1: '#FF8C1A',
        blocks: [
          {
            opcode: 'listToJson',
            blockType: Scratch.BlockType.REPORTER,
            text: '[LIST] listdagi maʼlumotlar (JS array)',
            arguments: {
              LIST: {
                type: Scratch.ArgumentType.STRING,
                menu: 'lists'
              }
            }
          },
          {
            opcode: 'listToTagged',
            blockType: Scratch.BlockType.REPORTER,
            text: '[LIST] listdagi elementlarni oʼsib boruvchi teglarda',
            arguments: {
              LIST: {
                type: Scratch.ArgumentType.STRING,
                menu: 'lists'
              }
            }
          }
        ],
        menus: {
          lists: {
            acceptReporters: true,
            items: 'getListNames'
          }
        }
      };
    }

    // Mavjud barcha list nomlarini dropdown ga chiqarish
    getListNames() {
      const lists = [];
      const targets = Scratch.vm.runtime.targets;
      for (const target of targets) {
        for (const varId in target.variables) {
          const variable = target.variables[varId];
          if (variable.type === 'list') {
            const name = variable.name;
            if (!lists.some(item => item.value === name)) {
              lists.push({
                text: name + (target.isStage ? ' (global)' : ''),
                value: name
              });
            }
          }
        }
      }
      return lists.length > 0 ? lists : [{ text: 'narsa', value: 'narsa' }];
    }

    // 1-blok: JSON array ko‘rinishida
    listToJson(args) {
      const listName = Scratch.Cast.toString(args.LIST);
      const listValue = this.getListValue(listName);
      return listValue ? JSON.stringify(listValue) : '[]';
    }

    // 2-blok: <1>birinchi</1><2>ikkinchi</2> ... ko‘rinishida
    listToTagged(args) {
      const listName = Scratch.Cast.toString(args.LIST);
      const listValue = this.getListValue(listName);
      if (!listValue || listValue.length === 0) return '';

      let result = '';
      listValue.forEach((item, index) => {
        // Index 1 dan boshlanadi (odamlar uchun qulayroq)
        const tagNumber = index + 1;
        // Elementni stringga aylantiramiz va maxsus belgilarni himoya qilamiz
        const safeItem = String(item)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        result += `<${tagNumber}>${safeItem}</${tagNumber}>`;
      });
      return result;
    }

    // Yordamchi funksiya: berilgan nomdagi listni topib, uning qiymatini qaytaradi
    getListValue(listName) {
      const targets = Scratch.vm.runtime.targets;
      for (const target of targets) {
        for (const varId in target.variables) {
          const variable = target.variables[varId];
          if (variable.type === 'list' && variable.name === listName) {
            return variable.value; // massiv qaytadi
          }
        }
      }
      return null;
    }
  }

  Scratch.extensions.register(new ListToJS());
})(Scratch);