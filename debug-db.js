// Debug script to check what's in the database
// Run this in the browser console

async function debugDatabase() {
  console.log("=== DEBUGGING DATABASE ===");

  // Check pipelines
  const pipelines = await DatabaseManager.pipeline.listPipelines(0, 10);
  console.log("Pipelines:", pipelines);

  for (const pipeline of pipelines) {
    console.log(`\n--- Pipeline: ${pipeline.name} (ID: ${pipeline.id}) ---`);
    const steps = await DatabaseManager.step.getSteps(pipeline.id);
    console.log("Steps:", steps);

    steps.forEach((step, index) => {
      console.log(`Step ${index + 1}: name="${step.name}", id="${step.id}"`);
    });
  }
}

// Run the debug function
debugDatabase().catch(console.error);
