import React, { useState, useEffect } from 'react';
import zlib from 'zlib';
import { useDoc } from '@docusaurus/theme-common/internal';

const JsonToTable = ({ data }) => {
  const [decodedData, setDecodedData] = useState({});

  const { frontMatter } = useDoc();

  useEffect(() => {
    if (data) {
      console.log('data', data);
      try {
        let decodedJSON = JSON.parse(
         data
        );
        console.log('decodedJSON', decodedJSON);
        setDecodedData(decodedJSON);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }, [data]);

  const extractPropertiesAndExamples = (json) => {
    try {
      if (!json || !json.requestBody || !json.requestBody.content) return {};

      const content = json.requestBody.content['application/json'];
      if (!content || !content.schema) return {};

      const schema = content.schema;
      let properties = {};

      // Function to extract properties
      const extract = (schema) => {
        if (schema.properties) {
          Object.assign(properties, schema.properties);
        }

        ['allOf', 'anyOf', 'oneOf'].forEach((key) => {
          if (schema[key]) {
            schema[key].forEach(subSchema => extract(subSchema));
          }
        });

        if (schema.$ref) {
          // Here you should resolve the reference. This is a placeholder logic.
          console.log(`Reference found: ${schema.$ref}. Implement reference resolution logic.`);
        }
      };

      extract(schema);

      // Extract examples if available
      let exampleObject = content.example || {};
      Object.keys(properties).forEach((key) => {
        if (exampleObject[key]) {
          properties[key].example = exampleObject[key];
        }
      });

      return properties;
    } catch (error) {
      console.error('Error extracting properties and examples:', error);
      return {};
    }
  };


  const renderTable = () => {
    if (!data.body) return null;

    const tableRows = Object.entries(data.body).map(([key, value]) => (
      <tr key={key}>
        <td>{key}</td>
        <td>{value}</td>
      </tr>
    ));

    return (
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </table>
    );
  };

  return <div>{renderTable()}</div>;
};

export default JsonToTable;
