import { NewsChekerPage } from './app.po';

describe('news-cheker App', () => {
  let page: NewsChekerPage;

  beforeEach(() => {
    page = new NewsChekerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
