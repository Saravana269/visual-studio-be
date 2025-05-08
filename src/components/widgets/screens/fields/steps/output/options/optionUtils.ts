
/**
 * Utility functions for handling options in the framework components
 */

/**
 * Generates all possible non-empty combinations of options for multiple select
 */
export const generateCombinations = (options: string[]): string[][] => {
  if (options.length === 0) return [];
  
  const result: string[][] = [];
  
  const backtrack = (start: number, current: string[]) => {
    if (current.length > 0) {
      result.push([...current]);
    }
    
    for (let i = start; i < options.length; i++) {
      current.push(options[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  };
  
  backtrack(0, []);
  return result;
};

/**
 * Builds CSS class names for option rows based on selection and review mode
 */
export const buildRowClassName = (isSelected: boolean, isReviewMode: boolean): string => {
  let rowClassName = "flex items-center justify-between p-2 rounded";
  
  if (!isReviewMode) {
    rowClassName += " cursor-pointer transition-colors";
    
    // Add selection styling only in Define mode
    if (isSelected) {
      rowClassName += " border-2 border-[#F97316] bg-[#F97316]/30 shadow-[0_0_12px_rgba(249,115,22,0.5)] font-medium";
    } else {
      rowClassName += " border border-[#00FF00]/20 bg-black/30 hover:bg-[#00FF00]/10";
    }
  } else {
    // Review mode styling
    rowClassName += " border border-[#00FF00]/20 bg-black/30";
  }
  
  return rowClassName;
};
