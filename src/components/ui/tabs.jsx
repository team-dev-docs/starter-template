import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { unified } from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import rehype2react from 'rehype-react';

import { cn } from "../../utils"

const processor = unified()
  .use(markdown)
  .use(remark2rehype)
  .use(rehype2react, { createElement: React.createElement });

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, children, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}>
      {children}
    </TabsPrimitive.List>
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}>
      {children}
  </TabsPrimitive.Trigger>
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}>
      {children}
    </TabsPrimitive.Content>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

const convertElementsToStrings = (parsedTabs) => {
  return parsedTabs.map((tab) => {
    if (typeof tab === 'string') {
      return tab
    } else {
      const htmlString = renderHTML(tab)
      return htmlString
    }
  })
}

const processChildren = (children) => {
  let handledChildren = convertElementsToStrings(children)
  const processedChildren = React.Children.toArray(handledChildren).map((child) => {
    if (typeof child === 'string') {
      const singleLineString = child.replace(/\\n/g, '\\\\n');
      return processor.processSync(singleLineString).result;
    } else {
      return child;
    }
  });

  return processedChildren;
};

const toMarkdown = (children) => {
  let markdownString = ``
  for(let child of children) {
    console.log("this is the child", child)
    let reactPropsString = child.props.children.join("")
    markdownString += reactPropsString
  }
  return markdownString
}


const parseTabs = (children) => {
  const tabs = []
  let currentTab = null

  React.Children.forEach(children, (child) => {
    if (typeof child === 'string') {
      const tabRegex = /\[Tab: (.*?)\](.*?)\[\/Tab\]/gs
      let match
      let lastIndex = 0

      while ((match = tabRegex.exec(child))) {
        const title = match[1].trim()
        const content = match[2].trim()

        if (match.index > lastIndex) {
          tabs.push({ type: 'text', content: child.slice(lastIndex, match.index) })
        }

        if (currentTab) {
          tabs.push(currentTab)
          currentTab = null
        }

        currentTab = { type: 'tab', title, content }
        tabs.push(currentTab)
        lastIndex = tabRegex.lastIndex
      }

      if (lastIndex < child.length) {
        tabs.push({ type: 'text', content: child.slice(lastIndex) })
      }
    } else {
      tabs.push(child)
    }
  })

  if (currentTab) {
    tabs.push(currentTab)
  }

  return tabs
}



const DevDocsTabs = ({ className, children, ...props }) => {
  return (
    <TabsPrimitive.Root defaultValue={props?.tabsList?.tabs[0]?.value || props?.tabsList?.tabs[0]}>
      <TabsList>
        {props.tabsList.tabs.map((tab, index) => (
          <TabsTrigger key={index} value={tab.value || tab}>
            {tab.title || tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {React.Children.map(children, (child, index) => (
        child
      ))}
    </TabsPrimitive.Root>
  )
}

export { DevDocsTabs, Tabs, TabsList, TabsTrigger, TabsContent }
