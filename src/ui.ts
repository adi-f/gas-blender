import { CANNOT_GET_CREATED, EanResult, EanSource, EanTank, calculate } from './calcularor';
import { COMPRESSOR_OUTPUT_200_BAR_STOPS_AT, DEFAULT_SOURCE_OXYGEN_PERCENTAGE } from './lakeland';
import { error, format, isAlmostZero, toInt } from './ui-helper';

export function init() {
  error.print = showError;
  setTimeout(() => { // wait for DOM
    setDefaults();
    registerListerners();
  });
}

function doCalculation() {

  const tankBefore: EanTank = {
      pressureBar: getInputValueParsed('.tankPressureBefore'),
      oxygenPercentage: getInputValueParsed('.tankOxygenBefore'),
  };

  const tankAfter: EanTank = {
      pressureBar: getInputValueParsed('.tankPressureTarget'),
      oxygenPercentage: getInputValueParsed('.tankOxygenTarget')
  };

  const source: EanSource = {
      oxygenPercentage: getInputValueParsed('.sourceOxygen')
  }

  try {
    const result: EanResult = calculate(tankBefore, tankAfter, source);
    displayResultDeleyed(result);
  } catch (error) {
    clearResult();
    showError(errorToString(error));
  }
}

function displayResultDeleyed(result: EanResult) {
  clearResult();
  setTimeout(() => {
    displayResult(result);
  }, 300);
}

function displayResult(result: EanResult) {
  const needToReleseGas = !isAlmostZero(result.releaseBar);
  setVisibility('.release', needToReleseGas);
  setInputValue('.releaseFromTank', '-' + format(result.releaseBar) + ' bar');
  setInputValue('.releaseFromTankTo', format(result.releaseBarToTarget) + ' bar');

  const needToBoost = !isAlmostZero(result.addBarEanSource);
  setVisibility('.booster', needToBoost);
  setInputValue('.addFromSource', '+' + format(result.addBarEanSource) + ' bar');
  setInputValue('.addFromSourceTo', format(result.addBarEanSourceToTarget) + ' bar');

  const needCompressor = !isAlmostZero(result.addBarAir);
  setVisibility('.compressor', needCompressor);
  setInputValue('.addAir', '+' + format(result.addBarAir) + ' bar');
  setInputValue('.addAirTo', format(result.addBarAirToTarget) + ' bar');

  hideError();
}

function clearResult() {
  displayResult({
    releaseBar: 0,
    releaseBarToTarget: 0,
    addBarEanSource: 0,
    addBarEanSourceToTarget: 0,
    addBarAir: 0,
    addBarAirToTarget: 0
  });
}

function registerListerners() {
  addListener('.calc', 'click', doCalculation);
}

function setDefaults() {
  setInputValue('.sourceOxygen', format(DEFAULT_SOURCE_OXYGEN_PERCENTAGE));
  setInputValue('.tankPressureTarget', format(COMPRESSOR_OUTPUT_200_BAR_STOPS_AT));
}

function getInputValueParsed(selector: string): number {
  const value = getInputValue(selector);
  const valueAsNumber = toInt(value);
  if (valueAsNumber < 0) {
    error(`'${valueAsNumber}' ist kleiner 0!`);
  }
  return valueAsNumber;
}
function getInputValue(selector: string): string {
  return (document.querySelector(selector) as HTMLInputElement).value;
}

function setInputValue(selector: string, value: string): void {
  (document.querySelector(selector) as HTMLInputElement).value = value;
}

function addListener(selector: string, eventType: string, action: () => void) {
  document.querySelector(selector).addEventListener(eventType, action);
}

function setVisibility(selector: string, visible: boolean) {
  const visibility = visible ? 'inherit' : 'hidden'
  document.querySelectorAll(selector).forEach((element: HTMLElement) => element.style.visibility = visibility)
}

function errorToString(error: any): string {
  let message = error?.message || String(error);
  if(message === CANNOT_GET_CREATED) {
    message = 'Zielgas nicht herstellbar';
  }
  return message;
}

function showError(message: string) {
  const errorElement: HTMLElement = document.querySelector('.error');
  errorElement.innerText = message;
  errorElement.style.display = 'inherit';
}

function hideError() {
  const errorElement: HTMLElement = document.querySelector('.error');
  errorElement.style.display = 'none';
}