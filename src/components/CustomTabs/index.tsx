import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

const CustomTabs = (
  props: {
    tabs: CustomTabsProps[];
    selectedTab: string;
    onTabsChange: (index: number) => void;
    children: React.ReactNode;
  },
) => {
  const index = props.tabs.findIndex(
    (tab: CustomTabsProps) => tab.tabTitle === props.selectedTab,
  );

  const onTabsChange = async (index: number) => {
    props.onTabsChange(index);
  };

  return (
    <Tabs
      index={index}
      onChange={onTabsChange}
      isLazy={true}
      defaultIndex={index}
      colorScheme={"enclosed-colored"}
    >
      <TabList>
        {props.tabs.map((tab: CustomTabsProps) => {
          return (
            <Tab
              key={tab.tabTitle}
              hidden={tab.isHidden}
              _selected={{
                fontWeight: "bold",
                borderBottom: "2px",
                borderBottomColor: "black",
              }}
            >
              {(tab.customTab ? "#" : "") + tab.tabTitle}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels>
        {props.tabs.map((tab: CustomTabsProps) => {
          return (
            <TabPanel p={0} key={tab.tabTitle}>
              {props.children}
            </TabPanel>
          );
        })}
      </TabPanels>
    </Tabs>
  );
};

export type CustomTabsProps = {
  tabTitle?: string;
  isHidden: boolean;
  tabIndex?: number;
  customTab?: boolean;
};

export { CustomTabs };
