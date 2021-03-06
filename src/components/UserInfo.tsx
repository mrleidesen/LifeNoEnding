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
  fireEmployee,
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
      <Text>
        <Badge mr={1} colorScheme="green">
          工位：
        </Badge>
        <Badge>{user.employeeCount}</Badge>
      </Text>
      <Text>
        {user.achievement === 1 && (
          <Badge mr={1} colorScheme="green">
            百万富翁
          </Badge>
        )}
      </Text>
      {user.achievement === 0 && (
        <Box mt={2}>
          <Text>目标 100W ！</Text>
          <Progress max={1000000} value={user.gold} />
        </Box>
      )}
      {/* {user.achievement === 1 && (
        <Box mt={2}>
          <Text>目标 100W ！</Text>
          <Progress max={1000000} value={user.gold} />
        </Box>
      )} */}
    </Box>
  );
};

type TActionType = 'work' | 'rest';

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
  const [nextType, setNextType] = useState<TActionType>();

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

  const onToggleAction = useCallback(
    (type: TActionType) => {
      const workType = isWorking ? 'rest' : 'work';
      setNextType(workType);
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
                  duration: null,
                  isClosable: true,
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
    },
    [clearTimer, isWorking, refetch, timer, toast, user.id, user.timeout]
  );

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

  const handleFire = async () => {
    try {
      const resp = await fireEmployee(user.id);

      if (resp?.success) {
        toast({
          title: '开除成功',
          position: 'top-right',
          status: 'success',
          duration: 1500,
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (timer && isError) {
      clearTimer();
      if (refetch) {
        refetch();
      }
    }
  }, [clearTimer, isError, refetch, timer]);

  useEffect(() => {
    if (nextType && !timer) {
      onToggleAction(nextType);
    }
  }, [nextType, onToggleAction, timer]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

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
            <Button colorScheme="red" onClick={handleFire}>
              辞退
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
