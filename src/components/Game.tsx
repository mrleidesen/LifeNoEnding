import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';

import { getEmployeeList, getUserEmployeeList, getUserInfo } from '@/axios';

import { SAVE_EMPLOYEE_KEY, SAVE_USER_KEY } from '@/constance';

import { EmpolyeeInfo, UserInfo } from './UserInfo';

export const Game: React.VFC = () => {
  const [saveTime, setSaveTime] = useState(0);
  const { data: user, refetch: userRefetch } = useQuery('user', getUserInfo);
  const { data: list = [], refetch: listRefetch } = useQuery(
    'user-employee',
    getUserEmployeeList
  );
  const { data: shop = [] } = useQuery('shop', getEmployeeList);
  const listIds = list.map((item) => item.id);

  const refetch = () => {
    userRefetch();
    listRefetch();
  };

  useEffect(() => {
    const now = Date.now();
    if (now - saveTime >= 1000 * 30 && user) {
      setSaveTime(now);

      localStorage.setItem(SAVE_USER_KEY, JSON.stringify(user));
      localStorage.setItem(SAVE_EMPLOYEE_KEY, JSON.stringify(list));
    }
  }, [list, saveTime, user]);

  if (!user) {
    return null;
  }

  return (
    <Tabs
      isFitted
      defaultIndex={0}
      h="full"
      display="flex"
      flexDirection="column"
    >
      <TabPanels flex={1} overflowY="auto">
        <TabPanel>
          <UserInfo user={user} />

          <Box display="flex" flexDirection="column" gap={2} mt={4}>
            {list.map((employee) => (
              <EmpolyeeInfo
                isEmployee
                key={employee.id}
                user={employee}
                refetch={refetch}
              />
            ))}
          </Box>
        </TabPanel>
        <TabPanel>
          <Box display="flex" flexDirection="column" gap={2}>
            {shop.map((employee) => (
              <EmpolyeeInfo
                key={employee.id}
                user={employee}
                isShop
                isEmployee={listIds.includes(employee.id)}
                refetch={refetch}
              />
            ))}
          </Box>
        </TabPanel>
      </TabPanels>
      <TabList flexShrink={0}>
        <Tab>面板</Tab>
        <Tab>招聘</Tab>
        {/* <Tab>商店</Tab> */}
      </TabList>
    </Tabs>
  );
};
