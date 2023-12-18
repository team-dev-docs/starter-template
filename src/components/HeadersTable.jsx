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

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

// import { Button } from "@/components/ui/button"

// need a place to put
const JsonToTable = ({ data, title, columns }) => {
  const [decodedData, setDecodedData] = useState({});

  useEffect(() => {
    if (data) {
      try {
        const decoded64JSON = atob(data);
        const decodedJSON = JSON.parse(decoded64JSON);
        console.log("what is the headers decoded", decodedJSON)
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
      console.log("what is the header value", value)
      if (value.value) {
        return (
          <TableRow key={key}>
            <TableCell>
              <h4>
                <span className="font-medium">{key}</span> string
              </h4>
              <p>{value.value}</p>
            </TableCell>
          </TableRow>
        );
      }
      return null;
    });

    let tableRows = [...iteratedTableRows];

    return (
      <>
        <Table>
          <TableBody>{tableRows}</TableBody>
        </Table>
        {nestedTables}
      </>
    );
  };

  return (
    <>
      {decodedData && Object.keys(decodedData).length > 0 && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>{title}</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardHeader>
                    <CardDescription>header params</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {decodedData && Object.keys(decodedData).length > 0 ? (
                      renderTable(decodedData)
                    ) : (
                      <p></p>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
      )}
    </>
  );
};

export default JsonToTable;
