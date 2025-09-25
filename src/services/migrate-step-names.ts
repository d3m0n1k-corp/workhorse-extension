import { DatabaseManager } from "@/lib/db/manager";

/**
 * Migration function to fix step names that were incorrectly saved as pipeline names
 * This should be run once to fix existing data
 */
export async function migratePipelineStepNames() {
    console.log("Starting migration of pipeline step names...");

    try {
        // Get all pipelines
        const pipelines = await DatabaseManager.pipeline.listPipelines(0, 100);

        for (const pipeline of pipelines) {
            console.log(`Migrating pipeline: ${pipeline.name}`);

            // Get all steps for this pipeline
            const steps = await DatabaseManager.step.getSteps(pipeline.id);

            for (const step of steps) {
                // If step name equals pipeline name, it's likely incorrect
                if (step.name === pipeline.name) {
                    console.log(`  Found incorrect step name: "${step.name}" (should be converter name)`);

                    // Try to determine the correct converter name from the config
                    // This is a best-effort approach since we can't know for sure
                    // what converter was intended without more context

                    // For now, we'll set it to a generic name and let users fix it manually
                    // In a real scenario, you might want to ask the user or use heuristics
                    const correctedStep = {
                        ...step,
                        name: "Unknown Converter" // User will need to select the correct converter
                    };

                    await DatabaseManager.step.updateStep(correctedStep);
                    console.log(`  Updated step name to: "${correctedStep.name}"`);
                }
            }
        }

        console.log("Migration completed successfully!");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

// Export a simpler function that can be called from console
(window as any).migratePipelineStepNames = migratePipelineStepNames;