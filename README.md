# cal-maker

Quickly make a printable yearly calendar from a CSV file

## inputs

The expected file input is a CSV file with 2 columns:

1. the name of an event
2. the date of the event

Note: there shouldn't be any header rows in the CSV

## output

From the CSV, a printable calendar is created. The layout should auto adjust to fit whatever you want, but I like landscape, minimal margins, headers/footers and background graphics off.

## options

### include holidays

This will auto add public US holidays to the generated calendar

### year

Defaults to the current year, but you can select a future year to generate
