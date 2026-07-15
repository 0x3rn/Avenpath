const fs = require('fs');
const path = require('path');

const curriculumDir = path.join(__dirname, 'curriculum');
const files = ['maths.json', 'biology.json', 'chemistry.json', 'physics.json', 'computer-science.json'];

const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

for (const file of files) {
  const filePath = path.join(curriculumDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    continue;
  }
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Ensure top-level wrapper
  if (!data.name) {
     const nameParts = file.replace('.json', '').split('-');
     const name = nameParts.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
     
     // Special formatting for specific files if they lack a name
     data.name = file === 'computer-science.json' ? 'Computer Science' : name;
     data.slug = slugify(data.name);
     data.description = `The study of ${data.name.toLowerCase()}.`;
     data.icon = "BookOpen";
     data.color = "#2563EB";
  }

  // Ensure fields are ordered nicely by creating a new object for top-level
  const migratedData = {
    name: data.name,
    slug: data.slug,
    description: data.description,
    icon: data.icon,
    color: data.color,
    topics: []
  };

  if (data.topics && Array.isArray(data.topics)) {
    migratedData.topics = data.topics.map(topic => {
      const topicId = topic.id || topic.slug || slugify(topic.name);
      
      const migratedTopic = {
        id: topicId,
        name: topic.name,
        slug: topic.slug || topicId,
        description: topic.description || "",
        levels: topic.levels || ["university"],
        estimatedHours: topic.estimatedHours || 0,
        prerequisites: topic.prerequisites || [],
        subtopics: []
      };
      
      if (topic.subtopics && Array.isArray(topic.subtopics)) {
        migratedTopic.subtopics = topic.subtopics.map(subtopic => {
          if (typeof subtopic === 'string') {
            return {
              id: slugify(subtopic),
              name: subtopic,
              slug: slugify(subtopic)
            };
          }
          return subtopic;
        });
        
        // Calculate dynamic estimated hours if it was 0
        if (migratedTopic.estimatedHours === 0) {
          migratedTopic.estimatedHours = migratedTopic.subtopics.length * 2;
        }
      }
      return migratedTopic;
    });
  }

  fs.writeFileSync(filePath, JSON.stringify(migratedData, null, 2), 'utf8');
  console.log(`Successfully migrated ${file}`);
}
