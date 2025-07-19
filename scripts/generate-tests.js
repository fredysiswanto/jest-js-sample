#!/usr/bin/env node

/**
 * CLI tool for generating FoodTrip API test cases
 */

const path = require('path');
const TestCaseGenerator = require('./test-case-generator');

function showUsage() {
  console.log(`
FoodTrip API Test Case Generator

Usage:
  npm run generate-tests                    # Generate from default Postman collection
  npm run generate-tests -- --output ./my-tests    # Specify output directory
  npm run generate-tests -- --help         # Show this help

Options:
  --output, -o    Output directory (default: ./generated-test-cases)
  --collection, -c Postman collection file (default: ../test-case/FoodTrip.postman_collection.json)
  --help, -h      Show this help message

Examples:
  npm run generate-tests
  npm run generate-tests -- --output ./api-tests
  npm run generate-tests -- --collection ./my-collection.json --output ./tests
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    collection: path.resolve(
      __dirname,
      '../test-case/FoodTrip.postman_collection.json'
    ),
    output: path.resolve(__dirname, '../generated-test-cases'),
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--output':
      case '-o':
        if (i + 1 < args.length) {
          options.output = path.resolve(args[++i]);
        } else {
          console.error('Error: --output requires a directory path');
          process.exit(1);
        }
        break;
      case '--collection':
      case '-c':
        if (i + 1 < args.length) {
          options.collection = path.resolve(args[++i]);
        } else {
          console.error('Error: --collection requires a file path');
          process.exit(1);
        }
        break;
      default:
        if (arg.startsWith('-')) {
          console.error(`Error: Unknown option ${arg}`);
          process.exit(1);
        }
    }
  }

  return options;
}

function main() {
  const options = parseArgs();

  if (options.help) {
    showUsage();
    return;
  }

  console.log('🚀 FoodTrip API Test Case Generator');
  console.log('=====================================');
  console.log(`📂 Collection: ${options.collection}`);
  console.log(`📁 Output: ${options.output}`);
  console.log('');

  try {
    const generator = new TestCaseGenerator(options.collection, options.output);
    generator.generateTestCases();

    console.log('');
    console.log('✅ Test case generation completed successfully!');
    console.log(`📋 Generated test cases are available in: ${options.output}`);
    console.log('');
    console.log('Next steps:');
    console.log('1. Review the generated test cases');
    console.log('2. Customize test data and expected responses');
    console.log('3. Run the tests using your preferred testing framework');
  } catch (error) {
    console.error('❌ Error generating test cases:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
