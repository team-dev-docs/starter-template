var Converter = require("openapi-to-postmanv2");
const fs = require("fs");
function parseOpenApiInfo(openapiData) {
   const operation = openapiData.api;
   const headers = {};
   const body = {};
   const query = {};
 
   // Parse security schemes
   if (operation.securitySchemes) {
     for (const [schemeName, schemeData] of Object.entries(operation.securitySchemes)) {
       switch (schemeData.type) {
         case "apiKey":
           if (schemeData.in === "header") {
             headers[schemeData.name] = "[API Key]"; // Placeholder for actual key
           }
           break;
         case "oauth2":
           // Handle OAuth2 details based on flow type
           break;
         default:
           // Handle other security scheme types
           break;
       }
     }
   }
 
   // Parse request body schema
   if (operation.requestBody) {
     const content = operation.requestBody.content["application/json"];
     if (content && content.schema) {
       const schema = content.schema;
       parseSchema(schema, "", body);
     }
   }
 
   // Parse path parameters (simulated as query for simplicity)
   const pathParams = operation.path.match(/\{[^}]+\}/g);
   if (pathParams) {
     for (const param of pathParams) {
       const paramName = param.slice(1, -1);
       query[paramName] = "[Path Parameter: " + paramName + "]"; // Placeholder
     }
   }
 
   // Parse query parameters (if any)
   // TODO: Implement logic to parse actual query parameters from request
 
   return { headers, body, query };
 }
 
 function parseSchema(schema, parentPath, targetObj) {
   if (schema.type === "object") {
     for (const [key, value] of Object.entries(schema.properties)) {
       const fullPath = parentPath ? `${parentPath}.${key}` : key;
       parseSchema(value, fullPath, targetObj);
     }
   } else if (schema.type === "array") {
     // Handle arrays (simple example, can be expanded)
     targetObj[parentPath] = "[Array]";
   } else {
     // Handle basic types (string, number, etc.)
     targetObj[parentPath] = "[Placeholder]";
   }
 }


function findMatchingItem(items, metadata) {
    // Check if items is not an array or is empty
    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    for (const item of items) {
        // Check if the item has a request and matches the metadata
        if (item?.request?.url?.path && metadata?.api?.path) {
            const pathMatches = `/${item.request.url.path.join("/")}` === metadata.api.path;
            const methodMatches = item.request.method.toLowerCase() === metadata.api.method.toLowerCase();

            if (pathMatches && methodMatches) {
                return item;
            }
        }

        // If the current item has nested items, search recursively
        if (item.item) {
            console.log("item.item", item.item)
            const foundItem = findMatchingItem(item.item, metadata);
            if (foundItem) {
                return foundItem;
            }
        }
    }

    let justUrls = items.map(item => {
      if(item?.request?.url?.path) {
          return `/${item.request.url.path.join("/")}`
      } else {
          return null
      }
   })

   console.log("this is justUrls", justUrls)
   console.log("this is metadata",  metadata.api.path)   

    // Return null if no matching item is found
    return null;
}

function generatePostmanItem(item) {
   try {
      const yamlData = fs.readFileSync(`examples/${petstore}.yaml`, "utf8");

      let conversionResult;
      let errorOccurred = false;

      Converter.convert(
        { type: "string", data: yamlData },
        {},
        (err, result) => {
          if (err) {
            console.error(err);
            errorOccurred = true;
          } else {
            conversionResult = result;
          }
        }
      );

      if (errorOccurred || !conversionResult) {
        return ""; // Return an empty string in case of error
      }
      let apiItems = conversionResult.output[0].data.item
      let flatItems = []
      for(let apiItem of apiItems) {
        flatItems = [...flatItems, ...apiItem.item]
      }

        let finalItem = findMatchingItem(flatItems, metadata);
        console.log("finalItem", finalItem != undefined)
        console.log("finalItem", finalItem)
        metadata.postmanItem = finalItem
     //  if(metadata.postmanItem) fs.writeFileSync("output.json", JSON.stringify(metadata, null, 2))
     //  return JSON.stringify(metadata, null, 2);
    } catch (err) {
      console.error(err);
      return ""; // Return an empty string in case of error
    }
}

function generateTemplate(metadata) {
   
}


const apiConfig = {
  petstore: {
    // the <id> referenced when running CLI commands
    specPath: "examples/pestore.yaml", // path to OpenAPI spec, URLs supported
    outputDir: "docs/api/petstore", // output directory for generated files
    sidebarOptions: {
      // optional, instructs plugin to generate sidebar.js
      groupPathsBy: "tag", // group sidebar items by operation "tag"
    },
    markdownGenerators: {
      createApiPageMD: (metadata) => {
         // console.log("metadata", metadata);
         
      },
    },
  },
};

module.exports = {
  config: apiConfig,
};
