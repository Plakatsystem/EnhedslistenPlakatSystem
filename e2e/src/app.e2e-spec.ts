import { AppPage } from './app.po';
import { browser, by, element } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;
  browser.driver.manage().window().maximize();
  let managerUsername;
  let managerPassword;
  let teamUsername;
  let teamPassword;

  beforeEach(() => {
    page = new AppPage();
  });

  //Verify login component
  it('1.0: should verify login component', () => {
    browser.get('');
    expect(element(by.tagName('h2')).getText()).toEqual('LOG IND');
  });

  //No login information
  it('1.1: should show error message if no input', () => {
    element(by.id('login-btn')).click();
    browser.sleep(2000);
    expect(element.all(by.tagName('mat-error')).get(0).getText()).toEqual('Du skal udfylde et brugernavn');
    expect(element.all(by.tagName('mat-error')).get(1).getText()).toEqual('Du skal udfylde en adgangskode');
  });

  //Wrong login information
  it('1.2: should show error message if wrong input', () => {
    element(by.id('username')).sendKeys('admi');
    element(by.id('password')).sendKeys('123456');
    browser.waitForAngularEnabled(false);
    element(by.id('login-btn')).click();
    browser.sleep(2000);
    expect(element(by.className('error')).getText()).toEqual('Brugernavn eller adgangskode er forkert');
  });

  //Enter login information
  it('1.3: should enter login information', () => {
    element(by.id('username')).sendKeys('n');
    browser.waitForAngularEnabled(false);
    element(by.id('login-btn')).click();
    browser.sleep(4000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'menu');
  });

  //Go to departments component
  it('1.4: should go to departments component', () => {
    browser.sleep(2000);
    element(by.id('departments')).click();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'departments');
  });

  //Create department
  it('1.5: should create a new department', () => {
    browser.sleep(1000);
    element.all(by.tagName('mat-row')).then((elementsBefore) => {
      let start = elementsBefore.length;
      element(by.className('create-button')).click();
      browser.sleep(1000);
      element(by.tagName('mat-dialog-container')).element(by.tagName('input')).sendKeys('Test department e2e');
      element(by.tagName('mat-dialog-container')).element(by.className('create-button')).click();
      browser.sleep(5000);
      expect(element(by.tagName('h2')).getText()).toEqual('Du har oprettet en ny afdeling');
      element(by.tagName('mat-dialog-container')).element(by.id('username')).getText().then((text) => {
        managerUsername = text.split(' ')[1];
      });
      element(by.tagName('mat-dialog-container')).element(by.id('password')).getText().then((text) => {
        managerPassword = text.split(' ')[2];
      });
      element(by.tagName('mat-dialog-container')).element(by.className('close-button')).click();
      element.all(by.tagName('mat-row')).then((elementsAfter) => {
        let end = elementsAfter.length;
        expect(end).toEqual(start + 1);
      });
    });
  });

  //Log out from admin
  it('1.6: should logout from admin', () => {
    browser.sleep(1000);
    element(by.id('logout-btn')).click();
    expect(element(by.className('login-header')).getText()).toEqual('LOG IND');
  });

  //Login as manager
  it('2: should login to manager', () => {
    element(by.id('username')).sendKeys(managerUsername);
    element(by.id('password')).sendKeys(managerPassword);
    browser.sleep(1000);
    element(by.id('login-btn')).click();
    browser.sleep(2000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'menu');
  });

  //Go to teams component
  it('2.1: should go to teams component', () => {
    element(by.id('teams')).click();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'teams');
  });

  //Create team
  it('2.2: should create a team', () => {
    browser.sleep(1000);
    element.all(by.tagName('mat-row')).then((elementsBefore) => {
      let start = elementsBefore.length;
      element(by.id('create-team-btn')).click();
      browser.sleep(1000);
      element(by.tagName('mat-dialog-container')).element(by.id('hang-team')).click();
      element(by.tagName('mat-dialog-container')).element(by.className('create-button')).click();
      browser.sleep(5000);
      expect(element(by.tagName('h2')).getText()).toEqual('Du har oprettet et nyt team');
      element(by.tagName('mat-dialog-container')).element(by.id('username')).getText().then((text) => {
        teamUsername = text.split(' ')[1];
      });
      element(by.tagName('mat-dialog-container')).element(by.id('password')).getText().then((text) => {
        teamPassword = text.split(' ')[1];
      });
      browser.sleep(1000);
      element(by.tagName('mat-dialog-container')).element(by.className('close-button')).click();
      browser.sleep(1000);
      element.all(by.tagName('mat-row')).then((elementsAfter) => {
        let end = elementsAfter.length;
        expect(end).toEqual(start + 1);
      });
    });
  });

  //Go back to menu
  it('2.3: should go back to the menu', () => {
    element(by.id('back-btn')).click();
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'menu');
  });

  //Go to poster component
  it('2.4: should go to the poster component', () => {
    element(by.id('posters')).click();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'posters');
  });

  //Create poster
  it('2.5: should create a poster', () => {
    browser.sleep(1000);
    element.all(by.tagName('mat-row')).then((elementsBefore) => {
      let start = elementsBefore.length;
      element(by.className('create-button')).click();
      browser.sleep(1000);
      element(by.tagName('mat-dialog-container')).element(by.id('poster-name')).sendKeys('Test poster e2e');
      element(by.tagName('mat-dialog-container')).element(by.id('poster-amount')).sendKeys(100);
      element(by.tagName('mat-dialog-container')).element(by.className('create-button')).click();
      browser.sleep(2000);
      expect(element(by.tagName('h2')).getText()).toEqual('Plakaten er oprettet');
      element(by.className('close-button')).click();
      browser.sleep(5000);
      element.all(by.tagName('mat-row')).then((elementsAfter) => {
        let end = elementsAfter.length;
        expect(end).toEqual(start + 1);
      });
    });
  });

  //Go back to menu
  it('2.6: should go back to the menu', () => {
    element(by.id('back-btn')).click();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'menu');
  });

  //Go to map component
  it('2.7: should go to the map component', () => {
    element(by.id('map')).click();
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'map');
  });

  //Go back to menu
  it('2.8: should go back to the menu', () => {
    element(by.id('back-btn')).click();
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'menu');
  });

  //Logout from manager
  it('2.9: it should logout from manager', () => {
    element(by.id('logout-btn')).click();
    expect(element(by.className('login-header')).getText()).toEqual('LOG IND');
  });

  //Login as team
  it('3: should login as a team', function() {
    element(by.id('username')).sendKeys(teamUsername);
    element(by.id('password')).sendKeys(teamPassword);
    browser.waitForAngularEnabled(false);
    element(by.id('login-btn')).click();
    browser.sleep(2000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'menu');
  });

  //Go to hang poster component
  it('3.1: should go to hang poster component', function() {
    element(by.id('hang-poster')).click();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'hang-poster');
  });

  //Go to menu
  it('3.2: should go back to the menu', () => {
    element(by.id('back-btn')).click();
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'menu');
  });

  //Go to edit poster component
  it('3.3: should edit a poster', function() {
    element(by.id('edit-hung-poster')).click();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + ('edit-hung-poster'));
  });

  //Go to menu
  it('3.4: should go back to the menu', () => {
    element(by.id('back-btn')).click();
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'menu');
  });

  //Go to map component
  it('3.5: should go to the map component', function() {
    element(by.id('map')).click();
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + ('map'));
  });

  //Go to menu
  it('3.6: should go back to the menu', () => {
    element(by.id('back-btn')).click();
    browser.sleep(1000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'menu');
  });

  //Log out from team
  it('3.7: should logout from team', () => {
    element(by.id('logout-btn')).click();
    expect(element(by.className('login-header')).getText()).toEqual('LOG IND');
  });

  //Delete test department
  it('4: should delete department created for test', function() {
    browser.get('');
    element(by.id('username')).sendKeys('admin');
    element(by.id('password')).sendKeys('123456');
    browser.waitForAngularEnabled(false);
    element(by.id('login-btn')).click();
    browser.sleep(2000);
    element(by.id('departments')).click();
    browser.sleep(2000);
    // Departments page
    let numberOfDepartments;
    element.all(by.id('department-name')).getText().then((result) => {
      let index = result.indexOf('Test department e2e');
      numberOfDepartments = result.length;
      element.all(by.className('delete-button')).then((response) => {
        response[index].click();
        element(by.id('delete')).click();
        browser.sleep(1000);
        element.all(by.id('department-name')).getText().then((result) => {
          expect(numberOfDepartments-1).toEqual(result.length);
        });
      });
    });
  });
});
