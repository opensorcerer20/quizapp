export const deckSettingsType = {
    pickOrder: ['random', 'sequential'],
    pickMode: ['bag', 'continuous'],
    cardMode: ['repeat', 'once'],
};

export const cleanDeckSettings = (pickOrder, pickMode, cardMode) => {
  return {
    pickOrder: deckSettingsType.pickOrder.includes(pickOrder) ? pickOrder : deckSettingsType.pickOrder[0],
    pickMode: deckSettingsType.pickMode.includes(pickMode) ? pickMode : deckSettingsType.pickMode[0],
    cardMode: deckSettingsType.cardMode.includes(cardMode) ? cardMode : deckSettingsType.cardMode[0],
  }
}
