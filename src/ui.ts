import * as $ from 'jquery';
import { calculate, EanResult, EanSource, EanTank } from "./calcularor";
import { format, toInt } from './ui-helper';

$('.calc').click(() => {
	const myTankBefore: EanTank = {
  	pressureBar: toInt($('.tankBeforePressure').val() as string),
   	oxygenPercentage: toInt($('.tankBeforOxygen').val() as string)
  }
  const sourceTank: EanSource = {
    oxygenPercentage: toInt($('.sourceOxygen').val() as string)
	}

	const myTankAfter: EanTank = {
  	pressureBar: toInt($('.tankAfterPressure').val() as string),
   	oxygenPercentage: toInt($('.tankAfterOxygen').val() as string)
  }
  
  const result: EanResult = calculate(myTankBefore, myTankAfter, sourceTank);
  
  const addBooster = 'add +' 
  	+ format(result.addBarEanSource) 
    + 'bar to ' 
    + format(result.addBarEanSourceToTarget) 
    + 'bar of EAN' 
    + format(sourceTank.oxygenPercentage);
  const addAir = 'add +'
  	+ format(result.addBarAir)
    + 'bar to '
    + format(result.addBarAirToTarget) 
    + 'bar of air';
  
  $('.addFromSource').val(addBooster);
  $('.addAir').val(addAir);
  
});