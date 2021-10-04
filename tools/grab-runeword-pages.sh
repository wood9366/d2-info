#!/usr/bin/env bash

function grab_page {
    URL=$1
    FILE=$2
    TEMP=${FILE}.temp

    curl -o "$TEMP" "$URL"

    if [ -s "$TEMP" ]
    then
        iconv -f iso8859-1 -t utf8 "$TEMP" > "$FILE"
    fi

    rm -f "$TEMP"
}

# grab_page "http://classic.battle.net/diablo2exp/items/runewords-original.shtml" rw-original.shtml
# grab_page "http://classic.battle.net/diablo2exp/items/runewords-110.shtml" rw-110.shtml
# grab_page "http://classic.battle.net/diablo2exp/items/runewords-111.shtml" rw-111.shtml
grab_page "http://classic.battle.net/diablo2exp/items/runes.shtml" rws.shtml
