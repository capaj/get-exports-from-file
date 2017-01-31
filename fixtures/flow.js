// @flow
export type DateRange = {
  since: Date,
  till: Date
}

export type DateInterval = {
  range: DateRange,
  flag: DateIntervalFlag
}

export type DateIntervalFlag = 'WEEK' | 'MONTH' | 'YESTERDAY' | 'TODAY' | null;
