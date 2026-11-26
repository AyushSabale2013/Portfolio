/* ==========================================================================
   Knowledge base entry point.

   Import this from the chatbot:
       import knowledge from "../../chatbot/knowledge";

   portfolio.json is the single source of truth. Validation problems never
   crash the chatbot; in development they are printed to the console.
   ========================================================================== */

import portfolioData from "./portfolio.json" with { type: "json" };
import { createKnowledgeBase } from "./retrieval.js";

const knowledge = createKnowledgeBase(portfolioData);

if (import.meta.env?.DEV) {
    knowledge.errors.forEach((message) => console.error(`[knowledge] ${message}`));
    knowledge.warnings.forEach((message) => console.warn(`[knowledge] ${message}`));
}

export { createKnowledgeBase } from "./retrieval.js";
export { validateKnowledge } from "./loader.js";
export default knowledge;