export type ClickAndCollectResponseLocation = {
  fulfilment: {
    isBuddyLocation: boolean;
    locationId: string;
    stock: {
      available: number;
    };
  };
  location: {
    locationId: string;
  };
};
