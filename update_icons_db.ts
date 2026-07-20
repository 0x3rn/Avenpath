import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./db";
import { subjects } from "./db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const fixes: Record<string, string> = {
    'Agriculture': 'Sprout',
    'Physics': 'Atom',
    'Astrophysics': 'Telescope',
    'Oceanography': 'Droplets',
    'Ecology': 'Leaf',
    'Zoology': 'Bug',
    'Radiology': 'Activity',
    'Veterinary Medicine': 'PawPrint',
    'General Surgery': 'Scissors',
    'Tax Law': 'Banknote',
    'Dental Medicine': 'Smile',
    'Dermatology': 'Smile',
    'Fine Arts': 'Palette',
    'Art': 'Palette',
    'Animal Science': 'PawPrint',
    'Animal Husbandry': 'PawPrint'
  };

  const allSubjects = await db.select({ id: subjects.id, name: subjects.name, icon: subjects.icon }).from(subjects);
  let updatedCount = 0;

  for (const subject of allSubjects) {
    let newIcon = subject.icon;

    if (fixes[subject.name]) {
      newIcon = fixes[subject.name];
    } else if (subject.name.includes('Law') && subject.icon === 'Banknotes') {
      newIcon = 'Banknote';
    }

    if (newIcon !== subject.icon && newIcon !== null) {
      await db.update(subjects).set({ icon: newIcon }).where(eq(subjects.id, subject.id));
      console.log(`Updated ${subject.name} from ${subject.icon} to ${newIcon}`);
      updatedCount++;
    }
  }

  console.log(`Total DB records updated: ${updatedCount}`);
  process.exit(0);
}

main().catch(console.error);
