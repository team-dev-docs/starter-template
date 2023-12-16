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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

// import { Button } from "@/components/ui/button"


const JsonToTable = ({ data, title }) => {
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
      <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
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
      </AccordionContent>
      </AccordionItem>
      </Accordion>
    );
  };

  return <div>{renderTable(decodedData)}</div>;
};

export default JsonToTable;
