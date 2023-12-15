const apiConfig = {
   petstore: { // the <id> referenced when running CLI commands
      specPath: "examples/petstore.yaml", // path to OpenAPI spec, URLs supported
      outputDir: "api/petstore", // output directory for generated files
      sidebarOptions: { // optional, instructs plugin to generate sidebar.js
        groupPathsBy: "tag", // group sidebar items by operation "tag"
      }
    }
}

module.exports = {
   config: apiConfig
}
