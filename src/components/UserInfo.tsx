import type { TEmployee, TUser } from '@/types';

import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Progress,
  Text,
  useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

import {
  employeeHospital,
  employeeRest,
  employeeWork,
  getSingleEmployee,
} from '@/axios';

export const UserInfo: React.VFC<{
  user: TUser;
}> = ({ user }) => {
  return (
    <Box>
      <Text>
        <Badge mr={1} colorScheme="green">
          名称：
        </Badge>
        <Badge>{user.name}</Badge>
      </Text>
      <Text>
        <Badge mr={1} colorScheme="green">
          金币：
        </Badge>
        <Badge>{user.gold}</Badge>
      </Text>
      <Box mt={2}>
        <Text>目标 100W ！</Text>
        <Progress max={1000000} value={user.gold} />
      </Box>
    </Box>
  );
};

export const EmpolyeeInfo: React.VFC<{
  user: TEmployee;
  isEmployee?: boolean;
  isShop?: boolean;
  refetch?: () => void;
}> = ({ user, isEmployee, refetch, isShop }) => {
  const toast = useToast();
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [isError, setIsError] = useState(false);

  const clearTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
      setIsWorking(false);
      setIsResting(false);
      setIsError(false);
      toast({
        title: '已取消任务',
        duration: 1500,
        status: 'warning',
      });
    }
  }, [timer, toast]);

  const onToggleAction = (type: 'work' | 'rest') => {
    if (timer) {
      clearTimer();
      return;
    }

    if (type === 'work') {
      setIsWorking(true);
      setTimer(
        setInterval(() => {
          employeeWork(user.id).then((resp) => {
            if (resp?.success) {
              if (refetch) {
                refetch();
              }
            } else {
              setIsError(true);
              toast({
                title: resp?.message ?? '出错了',
                position: 'top-left',
                status: 'error',
                duration: 2000,
              });
            }
          });
        }, user.timeout * 1000)
      );
    }

    if (type === 'rest') {
      setIsResting(true);
      setTimer(
        setInterval(() => {
          employeeRest(user.id).then((resp) => {
            if (resp?.success) {
              if (refetch) {
                refetch();
              }
            } else {
              setIsError(true);
              toast({
                title: resp?.message ?? '出错了',
                position: 'top-left',
                status: 'error',
                duration: 2000,
              });
            }
          });
        }, user.timeout * 1000)
      );
    }
  };

  const handleBuy = () => {
    if (isEmployee) {
      return;
    }

    getSingleEmployee(user.id).then((resp) => {
      if (resp?.success) {
        toast({
          title: '雇佣成功',
          position: 'top-right',
          status: 'success',
          duration: 2000,
        });
        if (refetch) {
          refetch();
        }
      } else {
        toast({
          title: resp?.message ?? '出错了',
          position: 'top-left',
          status: 'error',
        });
      }
    });
  };

  const goToHospital = () => {
    employeeHospital(user.id).then((resp) => {
      if (resp?.success) {
        if (refetch) {
          refetch();
          toast({
            title: resp?.message ?? '住院成功',
            position: 'top-right',
            status: 'success',
          });
        }
      } else {
        toast({
          title: resp?.message ?? '出错了',
          position: 'top-left',
          status: 'error',
        });
      }
    });
  };

  useEffect(() => {
    if (timer && isError) {
      clearTimer();
      if (refetch) {
        refetch();
      }
    }
  }, [clearTimer, isError, refetch, timer]);

  return (
    <Box borderWidth="1px" borderRadius="lg" p={2}>
      <Text>
        <Badge mr={1} colorScheme="green">
          名称：
        </Badge>
        <Badge>{user.name}</Badge>
      </Text>
      <Text>
        <Badge mr={1} colorScheme="green">
          健康：
        </Badge>
        <Badge colorScheme={user.hp < 20 ? 'red' : 'gray'}>
          {user.hp}/{user.maxHP}
        </Badge>
      </Text>
      <Text>
        <Badge mr={1} colorScheme="green">
          每{user.timeout}秒会获得金币：
        </Badge>
        <Badge>
          {user.gold.min} ~ {user.gold.max}
        </Badge>
      </Text>
      <Text>
        <Badge mr={1} colorScheme="green">
          每{user.timeout}秒健康值下降：
        </Badge>
        <Badge>
          {user.damage.min} ~ {user.damage.max}
        </Badge>
      </Text>
      {!isShop ? (
        <>
          <Text>
            <Badge mr={1} colorScheme="green">
              总计赚到：
            </Badge>
            <Badge>{user.total}</Badge>
          </Text>

          <ButtonGroup mt={2} flexWrap="wrap" size="sm" gap={1}>
            <Button
              isLoading={isWorking}
              loadingText={'取消打工'}
              onClick={() => onToggleAction('work')}
              colorScheme="blue"
              disabled={false}
            >
              打工
            </Button>
            <Button
              isLoading={isResting}
              loadingText={'取消休息'}
              onClick={() => onToggleAction('rest')}
              colorScheme="green"
              disabled={user.hp === user.maxHP}
            >
              休息
            </Button>
            <Button
              colorScheme="yellow"
              disabled={user.hp > 0}
              onClick={goToHospital}
            >
              住院 - 价格 {Math.max(Math.ceil(user.price / 2), 300)}
            </Button>
          </ButtonGroup>
        </>
      ) : (
        <>
          <Text>
            <Badge mr={1} colorScheme="green">
              价格：
            </Badge>
            <Badge>{user.price}</Badge>
          </Text>
          <ButtonGroup mt={2}>
            <Button onClick={handleBuy} isDisabled={isEmployee}>
              {isEmployee ? '已雇佣' : '雇佣'}
            </Button>
          </ButtonGroup>
        </>
      )}
    </Box>
  );
};
