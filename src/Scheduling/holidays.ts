import 'path';
import 'fs';

import * as chrono from 'chrono-node';

import { ParsingComponents, ParsingResult } from 'chrono-node/dist/results';

import { ParsingContext } from 'chrono-node/dist/chrono';

export const eHOLIDAY = "eOnHolidayParsed";


// this... is simpler than doing the stupid calculations...
const easters = new Map([
    [1900, 'April 15, 1900'],
    [1901, 'April 7, 1901'],
    [1902, 'March 30, 1902'],
    [1903, 'April 12, 1903'],
    [1904, 'April 3, 1904'],
    [1905, 'April 23, 1905'],
    [1906, 'April 15, 1906'],
    [1907, 'March 31, 1907'],
    [1908, 'April 19, 1908'],
    [1909, 'April 11, 1909'],
    [1910, 'March 27, 1910'],
    [1911, 'April 16, 1911'],
    [1912, 'April 7, 1912'],
    [1913, 'March 23, 1913'],
    [1914, 'April 12, 1914'],
    [1915, 'April 4, 1915'],
    [1916, 'April 23, 1916'],
    [1917, 'April 8, 1917'],
    [1918, 'March 31, 1918'],
    [1919, 'April 20, 1919'],
    [1920, 'April 4, 1920'],
    [1921, 'March 27, 1921'],
    [1922, 'April 16, 1922'],
    [1923, 'April 1, 1923'],
    [1924, 'April 20, 1924'],
    [1925, 'April 12, 1925'],
    [1926, 'April 4, 1926'],
    [1927, 'April 17, 1927'],
    [1928, 'April 8, 1928'],
    [1929, 'March 31, 1929'],
    [1930, 'April 20, 1930'],
    [1931, 'April 5, 1931'],
    [1932, 'March 27, 1932'],
    [1933, 'April 16, 1933'],
    [1934, 'April 1, 1934'],
    [1935, 'April 21, 1935'],
    [1936, 'April 12, 1936'],
    [1937, 'March 28, 1937'],
    [1938, 'April 17, 1938'],
    [1939, 'April 9, 1939'],
    [1940, 'March 24, 1940'],
    [1941, 'April 13, 1941'],
    [1942, 'April 5, 1942'],
    [1943, 'April 25, 1943'],
    [1944, 'April 9, 1944'],
    [1945, 'April 1, 1945'],
    [1946, 'April 21, 1946'],
    [1947, 'April 6, 1947'],
    [1948, 'March 28, 1948'],
    [1949, 'April 17, 1949'],
    [1950, 'April 9, 1950'],
    [1951, 'March 25, 1951'],
    [1952, 'April 13, 1952'],
    [1953, 'April 5, 1953'],
    [1954, 'April 18, 1954'],
    [1955, 'April 10, 1955'],
    [1956, 'April 1, 1956'],
    [1957, 'April 21, 1957'],
    [1958, 'April 6, 1958'],
    [1959, 'March 29, 1959'],
    [1960, 'April 17, 1960'],
    [1961, 'April 2, 1961'],
    [1962, 'April 22, 1962'],
    [1963, 'April 14, 1963'],
    [1964, 'March 29, 1964'],
    [1965, 'April 18, 1965'],
    [1966, 'April 10, 1966'],
    [1967, 'March 26, 1967'],
    [1968, 'April 14, 1968'],
    [1969, 'April 6, 1969'],
    [1970, 'March 29, 1970'],
    [1971, 'April 11, 1971'],
    [1972, 'April 2, 1972'],
    [1973, 'April 22, 1973'],
    [1974, 'April 14, 1974'],
    [1975, 'March 30, 1975'],
    [1976, 'April 18, 1976'],
    [1977, 'April 10, 1977'],
    [1978, 'March 26, 1978'],
    [1979, 'April 15, 1979'],
    [1980, 'April 6, 1980'],
    [1981, 'April 19, 1981'],
    [1982, 'April 11, 1982'],
    [1983, 'April 3, 1983'],
    [1984, 'April 22, 1984'],
    [1985, 'April 7, 1985'],
    [1986, 'March 30, 1986'],
    [1987, 'April 19, 1987'],
    [1988, 'April 3, 1988'],
    [1989, 'March 26, 1989'],
    [1990, 'April 15, 1990'],
    [1991, 'March 31, 1991'],
    [1992, 'April 19, 1992'],
    [1993, 'April 11, 1993'],
    [1994, 'April 3, 1994'],
    [1995, 'April 16, 1995'],
    [1996, 'April 7, 1996'],
    [1997, 'March 30, 1997'],
    [1998, 'April 12, 1998'],
    [1999, 'April 4, 1999'],
    [2000, 'April 23, 2000'],
    [2001, 'April 15, 2001'],
    [2002, 'March 31, 2002'],
    [2003, 'April 20, 2003'],
    [2004, 'April 11, 2004'],
    [2005, 'March 27, 2005'],
    [2006, 'April 16, 2006'],
    [2007, 'April 8, 2007'],
    [2008, 'March 23, 2008'],
    [2009, 'April 12, 2009'],
    [2010, 'April 4, 2010'],
    [2011, 'April 24, 2011'],
    [2012, 'April 8, 2012'],
    [2013, 'March 31, 2013'],
    [2014, 'April 20, 2014'],
    [2015, 'April 5, 2015'],
    [2016, 'March 27, 2016'],
    [2017, 'April 16, 2017'],
    [2018, 'April 1, 2018'],
    [2019, 'April 21, 2019'],
    [2020, 'April 12, 2020'],
    [2021, 'April 4, 2021'],
    [2022, 'April 17, 2022'],
    [2023, 'April 9, 2023'],
    [2024, 'March 31, 2024'],
    [2025, 'April 20, 2025'],
    [2026, 'April 5, 2026'],
    [2027, 'March 28, 2027'],
    [2028, 'April 16, 2028'],
    [2029, 'April 1, 2029'],
    [2030, 'April 21, 2030'],
    [2031, 'April 13, 2031'],
    [2032, 'March 28, 2032'],
    [2033, 'April 17, 2033'],
    [2034, 'April 9, 2034'],
    [2035, 'March 25, 2035'],
    [2036, 'April 13, 2036'],
    [2037, 'April 5, 2037'],
    [2038, 'April 25, 2038'],
    [2039, 'April 10, 2039'],
    [2040, 'April 1, 2040'],
    [2041, 'April 21, 2041'],
    [2042, 'April 6, 2042'],
    [2043, 'March 29, 2043'],
    [2044, 'April 17, 2044'],
    [2045, 'April 9, 2045'],
    [2046, 'March 25, 2046'],
    [2047, 'April 14, 2047'],
    [2048, 'April 5, 2048'],
    [2049, 'April 18, 2049'],
    [2050, 'April 10, 2050'],
    [2051, 'April 2, 2051'],
    [2052, 'April 21, 2052'],
    [2053, 'April 6, 2053'],
    [2054, 'March 29, 2054'],
    [2055, 'April 18, 2055'],
    [2056, 'April 2, 2056'],
    [2057, 'April 22, 2057'],
    [2058, 'April 14, 2058'],
    [2059, 'March 30, 2059'],
    [2060, 'April 18, 2060'],
    [2061, 'April 10, 2061'],
    [2062, 'March 26, 2062'],
    [2063, 'April 15, 2063'],
    [2064, 'April 6, 2064'],
    [2065, 'March 29, 2065'],
    [2066, 'April 11, 2066'],
    [2067, 'April 3, 2067'],
    [2068, 'April 22, 2068'],
    [2069, 'April 14, 2069'],
    [2070, 'March 30, 2070'],
    [2071, 'April 19, 2071'],
    [2072, 'April 10, 2072'],
    [2073, 'March 26, 2073'],
    [2074, 'April 15, 2074'],
    [2075, 'April 7, 2075'],
    [2076, 'April 19, 2076'],
    [2077, 'April 11, 2077'],
    [2078, 'April 3, 2078'],
    [2079, 'April 23, 2079'],
    [2080, 'April 7, 2080'],
    [2081, 'March 30, 2081'],
    [2082, 'April 19, 2082'],
    [2083, 'April 4, 2083'],
    [2084, 'March 26, 2084'],
    [2085, 'April 15, 2085'],
    [2086, 'March 31, 2086'],
    [2087, 'April 20, 2087'],
    [2088, 'April 11, 2088'],
    [2089, 'April 3, 2089'],
    [2090, 'April 16, 2090'],
    [2091, 'April 8, 2091'],
    [2092, 'March 30, 2092'],
    [2093, 'April 12, 2093'],
    [2094, 'April 4, 2094'],
    [2095, 'April 24, 2095'],
    [2096, 'April 15, 2096'],
    [2097, 'March 31, 2097'],
    [2098, 'April 20, 2098'],
    [2099, 'April 12, 2099'],
    [2100, 'March 28, 2100'],
    [2101, 'April 17, 2101'],
    [2102, 'April 9, 2102'],
    [2103, 'March 25, 2103'],
    [2104, 'April 13, 2104'],
    [2105, 'April 5, 2105'],
    [2106, 'April 18, 2106'],
    [2107, 'April 10, 2107'],
    [2108, 'April 1, 2108'],
    [2109, 'April 21, 2109'],
    [2110, 'April 6, 2110'],
    [2111, 'March 29, 2111'],
    [2112, 'April 17, 2112'],
    [2113, 'April 2, 2113'],
    [2114, 'April 22, 2114'],
    [2115, 'April 14, 2115'],
    [2116, 'March 29, 2116'],
    [2117, 'April 18, 2117'],
    [2118, 'April 10, 2118'],
    [2119, 'March 26, 2119'],
    [2120, 'April 14, 2120'],
    [2121, 'April 6, 2121'],
    [2122, 'March 29, 2122'],
    [2123, 'April 11, 2123'],
    [2124, 'April 2, 2124'],
    [2125, 'April 22, 2125'],
    [2126, 'April 14, 2126'],
    [2127, 'March 30, 2127'],
    [2128, 'April 18, 2128'],
    [2129, 'April 10, 2129'],
    [2130, 'March 26, 2130'],
    [2131, 'April 15, 2131'],
    [2132, 'April 6, 2132'],
    [2133, 'April 19, 2133'],
    [2134, 'April 11, 2134'],
    [2135, 'April 3, 2135'],
    [2136, 'April 22, 2136'],
    [2137, 'April 7, 2137'],
    [2138, 'March 30, 2138'],
    [2139, 'April 19, 2139'],
    [2140, 'April 3, 2140'],
    [2141, 'March 26, 2141'],
    [2142, 'April 15, 2142'],
    [2143, 'March 31, 2143'],
    [2144, 'April 19, 2144'],
    [2145, 'April 11, 2145'],
    [2146, 'April 3, 2146'],
    [2147, 'April 16, 2147'],
    [2148, 'April 7, 2148'],
    [2149, 'March 30, 2149'],
    [2150, 'April 12, 2150'],
    [2151, 'April 4, 2151'],
    [2152, 'April 23, 2152'],
    [2153, 'April 15, 2153'],
    [2154, 'March 31, 2154'],
    [2155, 'April 20, 2155'],
    [2156, 'April 11, 2156'],
    [2157, 'March 27, 2157'],
    [2158, 'April 16, 2158'],
    [2159, 'April 8, 2159'],
    [2160, 'March 23, 2160'],
    [2161, 'April 12, 2161'],
    [2162, 'April 4, 2162'],
    [2163, 'April 24, 2163'],
    [2164, 'April 8, 2164'],
    [2165, 'March 31, 2165'],
    [2166, 'April 20, 2166'],
    [2167, 'April 5, 2167'],
    [2168, 'March 27, 2168'],
    [2169, 'April 16, 2169'],
    [2170, 'April 1, 2170'],
    [2171, 'April 21, 2171'],
    [2172, 'April 12, 2172'],
    [2173, 'April 4, 2173'],
    [2174, 'April 17, 2174'],
    [2175, 'April 9, 2175'],
    [2176, 'March 31, 2176'],
    [2177, 'April 20, 2177'],
    [2178, 'April 5, 2178'],
    [2179, 'March 28, 2179'],
    [2180, 'April 16, 2180'],
    [2181, 'April 1, 2181'],
    [2182, 'April 21, 2182'],
    [2183, 'April 13, 2183'],
    [2184, 'March 28, 2184'],
    [2185, 'April 17, 2185'],
    [2186, 'April 9, 2186'],
    [2187, 'March 25, 2187'],
    [2188, 'April 13, 2188'],
    [2189, 'April 5, 2189'],
    [2190, 'April 25, 2190'],
    [2191, 'April 10, 2191'],
    [2192, 'April 1, 2192'],
    [2193, 'April 21, 2193'],
    [2194, 'April 6, 2194'],
    [2195, 'March 29, 2195'],
    [2196, 'April 17, 2196'],
    [2197, 'April 9, 2197'],
    [2198, 'March 25, 2198'],
    [2199, 'April 14, 2199'],
    [2200, 'April 6, 2200'],
    [2201, 'April 19, 2201'],
    [2202, 'April 11, 2202'],
    [2203, 'April 3, 2203'],
    [2204, 'April 22, 2204'],
    [2205, 'April 7, 2205'],
    [2206, 'March 30, 2206'],
    [2207, 'April 19, 2207'],
    [2208, 'April 3, 2208'],
    [2209, 'March 26, 2209'],
    [2210, 'April 15, 2210'],
    [2211, 'March 31, 2211'],
    [2212, 'April 19, 2212'],
    [2213, 'April 11, 2213'],
    [2214, 'March 27, 2214'],
    [2215, 'April 16, 2215'],
    [2216, 'April 7, 2216'],
    [2217, 'March 30, 2217'],
    [2218, 'April 12, 2218'],
    [2219, 'April 4, 2219'],
    [2220, 'April 23, 2220'],
    [2221, 'April 15, 2221'],
    [2222, 'March 31, 2222'],
    [2223, 'April 20, 2223'],
    [2224, 'April 11, 2224'],
    [2225, 'March 27, 2225'],
    [2226, 'April 16, 2226'],
    [2227, 'April 8, 2227'],
    [2228, 'March 23, 2228'],
    [2229, 'April 12, 2229'],
    [2230, 'April 4, 2230'],
    [2231, 'April 24, 2231'],
    [2232, 'April 8, 2232'],
    [2233, 'March 31, 2233'],
    [2234, 'April 20, 2234'],
    [2235, 'April 5, 2235'],
    [2236, 'March 27, 2236'],
    [2237, 'April 16, 2237'],
    [2238, 'April 1, 2238'],
    [2239, 'April 21, 2239'],
    [2240, 'April 12, 2240'],
    [2241, 'April 4, 2241'],
    [2242, 'April 17, 2242'],
    [2243, 'April 9, 2243'],
    [2244, 'March 31, 2244'],
    [2245, 'April 13, 2245'],
    [2246, 'April 5, 2246'],
    [2247, 'March 28, 2247'],
    [2248, 'April 16, 2248'],
    [2249, 'April 1, 2249'],
    [2250, 'April 21, 2250'],
    [2251, 'April 13, 2251'],
    [2252, 'March 28, 2252'],
    [2253, 'April 17, 2253'],
    [2254, 'April 9, 2254'],
    [2255, 'March 25, 2255'],
    [2256, 'April 13, 2256'],
    [2257, 'April 5, 2257'],
    [2258, 'April 25, 2258'],
    [2259, 'April 10, 2259'],
    [2260, 'April 1, 2260'],
    [2261, 'April 21, 2261'],
    [2262, 'April 6, 2262'],
    [2263, 'March 29, 2263'],
    [2264, 'April 17, 2264'],
    [2265, 'April 2, 2265'],
    [2266, 'March 25, 2266'],
    [2267, 'April 14, 2267'],
    [2268, 'April 5, 2268'],
    [2269, 'April 18, 2269'],
    [2270, 'April 10, 2270'],
    [2271, 'April 2, 2271'],
    [2272, 'April 21, 2272'],
    [2273, 'April 6, 2273'],
    [2274, 'March 29, 2274'],
    [2275, 'April 18, 2275'],
    [2276, 'April 2, 2276'],
    [2277, 'April 22, 2277'],
    [2278, 'April 14, 2278'],
    [2279, 'March 30, 2279'],
    [2280, 'April 18, 2280'],
    [2281, 'April 10, 2281'],
    [2282, 'March 26, 2282'],
    [2283, 'April 15, 2283'],
    [2284, 'April 6, 2284'],
    [2285, 'March 22, 2285'],
    [2286, 'April 11, 2286'],
    [2287, 'April 3, 2287'],
    [2288, 'April 22, 2288'],
    [2289, 'April 7, 2289'],
    [2290, 'March 30, 2290'],
    [2291, 'April 19, 2291'],
    [2292, 'April 10, 2292'],
    [2293, 'March 26, 2293'],
    [2294, 'April 15, 2294'],
    [2295, 'April 7, 2295'],
    [2296, 'April 19, 2296'],
    [2297, 'April 11, 2297'],
    [2298, 'April 3, 2298'],
    [2299, 'April 16, 2299'],
]);


function getEaster(year: number, holiday: { type: string; date: any; nth: number; month: number; day: number; func: Function; }): Date {
    let d = new Date(easters.get(year));
    holiday.month = d.getMonth() + 1;//TODO: investigate off by one error here
    holiday.date = d.getDate();
    return d;
}

// TODO: add more holidays, also add user configuration option to add personal holidays
export const holidays =
    [
        { "type": "rel", "month": 0, "day": 1, "nth": 3, "rrule": "jan on third mon", "name": "(martin luther king('?s)?(, j(unio)?r\\.?)?|mlk) day" },
        { "type": "rel", "month": 1, "day": 1, "nth": 3, "rrule": "feb on third mon", "name": "(george )?washington('?s)? (birth?)day" },
        { "type": "rel", "month": 1, "day": 1, "nth": 3, "rrule": "feb on third mon", "name": "president('?s|s') day" },
        { "type": "rel", "month": 4, "day": 0, "nth": 2, "rrule": "may on second sun", "name": "mother'?s day" },
        { "type": "rel", "month": 4, "day": 1, "nth": -1, "rrule": "may on last mon", "name": "memorial day" },
        { "type": "rel", "month": 5, "day": 0, "nth": 3, "rrule": "jun on third sun", "name": "father'?s day" },
        { "type": "rel", "month": 8, "day": 1, "nth": 1, "rrule": "sep on first mon", "name": "labou?r day" },
        { "type": "rel", "month": 9, "day": 1, "nth": 2, "rrule": "oct on second mon", "name": "columbus'? day" },
        { "type": "rel", "month": 10, "day": 4, "nth": 4, "rrule": "nov on fourth thurs", "name": "thanksgiving( day)?" },

        { "type": "abs", "month": 1, "date": 2, "name": "(groundhog|daks) day" },
        { "type": "abs", "month": 2, "date": 17, "name": "(st\\.?|saint) pat(ty|rick)'?s( day)?" },
        { "type": "abs", "month": 3, "date": 1, "name": "april fools'?( day)?" },
        { "type": "abs", "month": 6, "date": 4, "name": "independence day" },
        { "type": "abs", "month": 9, "date": 31, "name": "halloween" },
        { "type": "abs", "month": 10, "date": 11, "name": "(armistice|rememberance) day" },
        { "type": "abs", "month": 10, "date": 11, "name": "veteran('?s|s') day" },
        { "type": "abs", "month": 11, "date": 24, "name": "christmas eve" },
        { "type": "abs", "month": 11, "date": 25, "name": "christmas( day)?" },
        { "type": "abs", "month": 11, "date": 31, "name": "new year('?s|s') eve" },
        { "type": "abs", "month": 0, "date": 1, "name": "new year('?s)?( day)?" },

        /** TODO: currently there's no clean way to integrate calculated holidays for recurrences
         * like 'every day except every other easter'... it would require manual processing
         * non-recurrance use works fine, like "next easter" or "every day except next easter"
         */
        { "type": "calc", "func": getEaster, "name": "easter" },


    ];




const determineYear = (ref: string | number | Date, match: string[]) => {
    if (match[1] === undefined)
        return new Date(ref).getFullYear();
    return parseInt(match[1]);
};

const determineDate = (year: number, holiday: { type: string; date: any; nth: number; month: number; day: number; func: Function; }) => {
    if (holiday.type === 'abs')
        return holiday.date;

    else if (holiday.type === 'calc')
        return (holiday.func(year, holiday) as Date).getDate();

    if (holiday.nth > 0) {
        const firstOfMonth = new Date(Date.UTC(
            year, holiday.month, 1,
            0, 1, 0, 0 // 1 minute so i don't have to think about midnight
        ));
        let weekInDays = (holiday.nth - 1) * 7;
        return (holiday.day - firstOfMonth.getUTCDay() + 7) % 7 + weekInDays + 1;
    }

    const endOfMonth = new Date(Date.UTC(
        year, holiday.month + 1, 0, // will get the last day of holiday.month
        0, 1, 0, 0
    ));
    return endOfMonth.getUTCDate() - (endOfMonth.getUTCDay() - holiday.day + 7) % 7 + (holiday.nth + 1) * 7;
};

export const regexFromName = (name: string) => (
    // ('((last|this|next|few|half|couple) )?' + name + '(s|es)?' + '( ago)?')                  // plurals (e.g. 2 christmases ago)
    (name + '(s|es)?')                  // plurals (e.g. 2 christmases ago)
        .replace(/ /g, '((\\s+)|-?)')            // space to whitespace
        .replace(/\(/g, '(?:')              // all groups non-capturing
    + '(?:\\s+(?:in\\s+)?(\\d+))?'      // add date parsing
);

export function holidayProcess(context: ParsingContext, match: RegExpMatchArray, holiday: any) {
    const year = determineYear(context.refDate, match);
    const day = determineDate(year, holiday);
    const date = new Date();
    const pattern = new RegExp(regexFromName(holiday.name), 'i');
    date.setFullYear(year, holiday.month, day);
    dispatchEvent(new CustomEvent(eHOLIDAY, {
        detail: {
            input: match.input,
            holiday: holiday,
            pattern: pattern,
            date: date
        }
    }));
    return { year, day };
}



