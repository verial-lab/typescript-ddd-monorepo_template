"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  UuidGenerator: () => UuidGenerator,
  idGenerator: () => idGenerator
});
module.exports = __toCommonJS(index_exports);

// src/UuidGenerator.ts
var import_logger = require("@repo-packages/logger");
var import_uuid = require("uuid");
var UuidGenerator = class {
  /**
   * Generate a new UUID v4
   * @returns A UUID v4 string
   */
  generate() {
    try {
      return (0, import_uuid.v4)();
    } catch (error) {
      import_logger.logger.error({ error }, "Failed to generate UUID");
      throw error;
    }
  }
};

// src/IdGeneratorService.ts
var idGenerator = new UuidGenerator();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UuidGenerator,
  idGenerator
});
//# sourceMappingURL=index.cjs.map