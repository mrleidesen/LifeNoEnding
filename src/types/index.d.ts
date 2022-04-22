export type TLimit = {
  min: number;
  max: number;
};

export interface TUser {
  name: string;
  gold: number;
  achievement: number;
  employeeCount: number;
}

export interface TEmployee {
  id: number;
  name: string;
  hp: number;
  gold: TLimit;
  damage: TLimit;
  price: number;
  timeout: number;
  total: number;
  maxHP: number;
}

export interface TShopItem {
  id: number;
  name: string;
  price: number;
}
