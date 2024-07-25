import { v4 as uuid } from "uuid"
/**
 * @param {Function} callback Optional callback to generate the id 
 * @defaults uuidV4
 */
export const generateId = (callback = uuid) => callback()
