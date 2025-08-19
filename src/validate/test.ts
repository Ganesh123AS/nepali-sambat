export function validateMultipleYears(config: { [key: string]: Record<number, number> }) {
  const errors: string[] = [];

  console.log("Starting validation for config:", Object.keys(config));

  try {
    for (const [year, monthDays] of Object.entries(config)) {
      console.log(`Processing year: ${year}`);
      console.log(`MonthDays:`, monthDays);
      let months: number[];
      try {
        months = Object.keys(monthDays).map(Number);
        console.log(`Months:`, months);
        const uniqueMonths = new Set(months);
        if (uniqueMonths.size !== months.length) {
          const duplicates = months.filter((month, index) => months.indexOf(month) !== index);
          errors.push(`Year ${year}: Duplicate months found: ${duplicates.join(", ")}`);
        }
      } catch (e) {
        errors.push(`Year ${year}: Error processing months: ${e instanceof Error ? e.message : String(e)}`);
      }
      try {
        const invalidMonths = months.filter(month => !Number.isNaN(month) && (month < 1 || month > 12));
        if (invalidMonths.length > 0) {
          errors.push(`Year ${year}: Invalid month numbers found: ${invalidMonths.join(", ")}`);
        }
      } catch (e) {
        errors.push(`Year ${year}: Error checking invalid months: ${e instanceof Error ? e.message : String(e)}`);
      }
      try {
        if (months.length !== 12) {
          errors.push(`Year ${year}: Incorrect number of months: ${months.length} (expected 12)`);
        }
      } catch (e) {
        errors.push(`Year ${year}: Error checking month count: ${e instanceof Error ? e.message : String(e)}`);
      }
      try {
        const totalDays = Object.values(monthDays).reduce((sum, days) => {
          if (typeof days !== "number" || Number.isNaN(days)) {
            throw new Error(`Invalid day count for year ${year}: ${days}`);
          }
          return sum + days;
        }, 0);
        console.log(`Total days for ${year}: ${totalDays}`);
        if (totalDays !== 365 && totalDays !== 366) {
          errors.push(`Year ${year}: Total days (${totalDays}) is not 365 or 366`);
        }
      } catch (e) {
        errors.push(`Year ${year}: Error calculating total days: ${e instanceof Error ? e.message : String(e)}`);
      }
      try {
        const invalidDays = Object.entries(monthDays).filter(([month, days]) => ![29, 30, 31, 32].includes(days));
        if (invalidDays.length > 0) {
          errors.push(`Year ${year}: Invalid day counts in months: ${invalidDays.map(([month, days]) => `Month ${month} has ${days} days`).join(", ")}`);
        }
      } catch (e) {
        errors.push(`Year ${year}: Error checking day counts: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  } catch (e) {
    errors.push(`Unexpected error during validation: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (errors.length > 0) {
    console.log(`Found ${errors.length} errors:`);
    for (let i = 0; i < errors.length; i++) {
      console.log(`Error ${i + 1}: ${errors[i]}`);
    }
  } else {
    console.log("Validation passed: All years have valid month configurations.");
  }
}