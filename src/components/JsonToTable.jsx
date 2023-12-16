import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const JsonToTable = ({ data }) => {
  const [decodedData, setDecodedData] = useState({});

  useEffect(() => {
    if (data) {
      try {
        const decoded64JSON = atob(data);
        const decodedJSON = JSON.parse(decoded64JSON);
        setDecodedData(decodedJSON);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }, [data]);

  const renderTable = (json, tableName = 'Root') => {
    if (!json) return null;

    const nestedTables = [];

    const tableRows = Object.entries(json).map(([key, value]) => {
      if (typeof value === 'object') {
        // Render nested objects as separate tables
        nestedTables.push(renderTable(value, key));
        return null; // Skip rendering this row in the current table
      } else {
        return (
          <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        );
      }
    });

    return (
      <div key={tableName}>
        <pre>
          <code>{JSON.stringify(decodedData, null, 2)}</code>
        </pre>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{tableName}</TableHeader>
              <TableHeader>Value</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
        {nestedTables}
      </div>
    );
  };

  return <div>{renderTable(decodedData)}</div>;
};

export default JsonToTable;
