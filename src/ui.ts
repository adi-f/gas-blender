import { calculate, EanResult, EanSource, EanTank } from "./calcularor";
import { BlendResult, calculateForRemosEquiptment, COMPRESSOR_OUTPUT_200_BAR_STOPS_AT, DEFAULT_SOURCE_OXYGEN_PERCENTAGE, displayToRealPressureBar } from './remo-calculator';
import { error, format, isAlmostZero, toInt } from './ui-helper';

export function init() {
  error.print = showError;
  setTimeout(() => { // wait for DOM
    setDefaults();
    registerListerners();
  });
}

function updateTankPressure() {
  const pressureBarDisplayed = getInputValue('.tankPressureBeforeDesiplayed');
  const pressureBarDisplayedAsNumber = parseInt(pressureBarDisplayed);
  const pressureBar = displayToRealPressureBar(pressureBarDisplayedAsNumber);
  if (Number.isFinite(pressureBarDisplayedAsNumber) && pressureBar >= 0) {
    setInputValue('.tankPressureBefore', format(pressureBar));
  } else {
    setInputValue('.tankPressureBefore', '');
  }
}

function doCalculation() {
  const result: BlendResult = calculateForRemosEquiptment({
    currentPressureTankBarDisplayed: getInputValueParsed('.tankPressureBeforeDesiplayed'),
    currentOxygenPercentage: getInputValueParsed('.tankOxygenBefore'),

    targetTankPressureBar: getInputValueParsed('.tankPressureTarget'),
    targetTankOxygenPercentage: getInputValueParsed('.tankOxygenTarget'),

    sourceTankOgygenPercentage: getInputValueParsed('.sourceOxygen')
  });

  displayResultDeleyed(result);
}

function displayResultDeleyed(result: BlendResult) {
  displayResult({
    releaseBar: 0,
    releaseBarTo: 0,
    releaseBarToDisplayBooster: 0,
    addBarSource: 0,
    addBarSourceToDisplayBooster: 0,
    addBarAir: 0,
    addBarAirTo: 0,
    addBarAirToDisplayCompressor: 0
  });
  setTimeout(() => {
    displayResult(result);
  }, 300);
}

function displayResult(result: BlendResult) {
  const needToReleseGas = !isAlmostZero(result.releaseBar);
  setVisibility('.release', needToReleseGas);
  setInputValue('.releaseFromTank', '-' + format(result.releaseBar) + ' bar');
  setInputValue('.releaseFromTankTo', format(result.releaseBarTo) + ' bar');

  const needToBoost = !isAlmostZero(result.addBarSource);
  setVisibility('.booster', needToBoost);
  setInputValue('.addFromSource', '+' + format(result.addBarSource) + ' bar');
  setInputValue('.addFromSourceTo', format(result.addBarSourceToDisplayBooster) + ' bar');

  const needCompressor = !isAlmostZero(result.addBarAir);
  setVisibility('.compressor', needCompressor);
  setInputValue('.addAir', '+' + format(result.addBarAir) + ' bar');
  setInputValue('.addAirTo', format(result.addBarAirToDisplayCompressor) + ' bar');

  hideError();
}

function registerListerners() {
  addListener('.calc', 'click', doCalculation);
  addListener('.tankPressureBeforeDesiplayed', 'input', updateTankPressure)
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

function showError(message: string) {
  const errorElement: HTMLElement = document.querySelector('.error');
  errorElement.innerText = message;
  errorElement.style.display = 'inherit';
}

function hideError() {
  const errorElement: HTMLElement = document.querySelector('.error');
  errorElement.style.display = 'none';
}