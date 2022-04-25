import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import {
  updateCustomTab,
  updateSelectedTab,
} from "../../pages/Home/Home.slice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ArticleList } from "../ArticleList";

const CustomTabs = (props: { tabs: IProps }) => {
  const { selectedTab } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const index = props.tabs.tabs.findIndex(
    (tab: CustomTabsProps) => tab.tabTitle === selectedTab,
  );

  const onTabsChange = async (index: number) => {
    let tabName = props.tabs.tabs.find((a) => a.tabIndex === index)?.tabTitle;
    if (index !== 2) {
      dispatch(updateCustomTab({
        tab: {
          isHidden: true,
        },
      }));
    }
    dispatch(updateSelectedTab({ tab: tabName! }));
  };

  return (
    <Tabs
      index={index}
      onChange={onTabsChange}
      isLazy={true}
      defaultIndex={index}
    >
      <TabList>
        {props.tabs.tabs.map((tab: CustomTabsProps) => {
          return (
            <Tab key={tab.tabTitle} hidden={tab.isHidden}>
              {(tab.tabIndex === 2 ? "#" : "") + tab.tabTitle}
            </Tab>
          );
        })}
      </TabList>
      <TabPanels>
        {props.tabs.tabs.map((tab: CustomTabsProps) => {
          return (
            <TabPanel p={0} key={tab.tabTitle}>
              <ArticleList />
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
};

type IProps = {
  tabs: CustomTabsProps[];
  isAuthenticated: boolean;
};

export { CustomTabs };
