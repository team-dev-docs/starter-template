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

import { unified } from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(rehype2react, { createElement: React.createElement });

// import { Button } from "@/components/ui/button"

// need a place to put 
const JsonToTable = ({ data, title, columns }) => {
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

    const iteratedTableRows = Object.entries(json).map(([key, value]) => {
      if (typeof value === 'object') {
        // Render nested objects as separate tables
        nestedTables.push(renderTable(value, key));
        return null; // Skip rendering this row in the current table
      } else {
        let markdownResult = processor.processSync(value).result
        console.log("markdown result", markdownResult)
        return (
          <TableRow key={key}>
            <TableCell className="font-medium">
              <h3>{key}</h3>
              <br></br>
              {markdownResult}
              <br></br>
              <p>Other Text that is important</p>
            </TableCell>
          </TableRow>
        );
      }
    });

    let tableRows = [
      ...iteratedTableRows
    ] 

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
              <TableCell>YO</TableCell>
              <TableCell>Value</TableCell>
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
