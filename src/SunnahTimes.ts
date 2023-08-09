import {
  dateByAddingDays,
  dateByAddingSeconds,
  roundedMinute,
} from './DateUtils';
import PrayerTimes from './PrayerTimes';

export enum MidnightMethod {
  SunsetToSunrise = 'SunsetToSunrise',
  SunsetToFajr = 'SunsetToFajr',
}

export class SunnahTimes {
  middleOfTheNight: Date;
  lastThirdOfTheNight: Date;
  /** night duration in milliseconds */
  nightDuration: number;

  constructor(prayerTimes: PrayerTimes, midnightMethod?: MidnightMethod) {
    const date = prayerTimes.date;
    const nextDay = dateByAddingDays(date, 1);
    const nextDayPrayerTimes = new PrayerTimes(
      prayerTimes.coordinates,
      nextDay,
      prayerTimes.calculationParameters,
    );

    let dawnTime;
    switch (midnightMethod) {
      case MidnightMethod.SunsetToFajr:
        dawnTime = nextDayPrayerTimes.fajr.getTime();
        break;
      case MidnightMethod.SunsetToSunrise:
      default:
        dawnTime = nextDayPrayerTimes.sunrise.getTime();
        break;
    }

    this.nightDuration = dawnTime - prayerTimes.sunset.getTime();

    const nightDurationSecs = this.nightDuration / 1000.0;

    this.middleOfTheNight = roundedMinute(
      dateByAddingSeconds(prayerTimes.sunset, nightDurationSecs / 2),
    );
    this.lastThirdOfTheNight = roundedMinute(
      dateByAddingSeconds(prayerTimes.sunset, nightDurationSecs * (2 / 3)),
    );
  }
}

export default SunnahTimes;
