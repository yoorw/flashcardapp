import { Card } from '../types';
import { getAdditionCard } from './utils';


describe('getAdditionCard', () => {
  it('should produce random questions', () => {
    const randomCard: Card = getAdditionCard();
    const anotherRandomCard: Card = getAdditionCard();
    expect(randomCard.question).not.toEqual(anotherRandomCard.question);
  });
});
