// src/UuidGenerator.ts
import { logger } from "@repo-packages/logger";
import { v4 as uuidv4 } from "uuid";
var UuidGenerator = class {
  /**
   * Generate a new UUID v4
   * @returns A UUID v4 string
   */
  generate() {
    try {
      return uuidv4();
    } catch (error) {
      logger.error({ error }, "Failed to generate UUID");
      throw error;
    }
  }
};

// src/IdGeneratorService.ts
var idGenerator = new UuidGenerator();
export {
  UuidGenerator,
  idGenerator
};
//# sourceMappingURL=index.js.map