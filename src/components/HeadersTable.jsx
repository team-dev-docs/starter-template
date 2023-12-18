import React, { useState, useEffect } from "react";
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
        console.error("Error parsing JSON:", error);
      }
    }
  }, [data]);

  const renderTable = (json, tableName = "Root") => {
    if (!json) return null;

    const nestedTables = [];

    const iteratedTableRows = Object.entries(json).map(([key, value]) => {
        return (
          <TableRow key={key}>
            <TableCell>
              <h4><span className="font-medium">{key}</span> {value.value}</h4>
              <p>{value.description}</p>
            </TableCell>
          </TableRow>
        );
      
    });

    let tableRows = [...iteratedTableRows];

    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionContent>
            <div key={tableName}>
              {/* <pre>
                <code>{JSON.stringify(decodedData, null, 2)}</code>
              </pre> */}
              <Table>

                <TableBody>{tableRows}</TableBody>
              </Table>
              {nestedTables}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

return (
    <div>
        {decodedData && Object.keys(decodedData).length > 0 ? (
            renderTable(decodedData)
        ) : (
            <p>No data available.</p>
        )}
    </div>
);
};

export default JsonToTable;
