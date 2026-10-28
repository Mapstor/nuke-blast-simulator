# Wave 1 data sourcing: 10 country pages (2026-10-22)

Scope: /nuclear-weapons-by-country/{united-states, russia, china, north-korea, israel, iran, france, united-kingdom, india, pakistan}. Files: facts.csv (372 rows), sources-new.csv (37 sources not yet in research/sources.csv), data-sources-rows.csv (9 registry rows). Retrieved 2026-10-22.

## Chat verification (2026-10-22)
- FAS Status of World Nuclear Forces 2026 table re-fetched: every country row and the totals (~12,187 inventory, ~9,745 stockpile) match facts.csv.
- IAEA GOV/2026/50 (1 Sep 2026, Iran Watch copy) re-fetched: 9874.9 kg total, 440.9 kg up to 60%, 184.1 kg up to 20%, 6024.4 kg up to 5% (estimates as of 13 Jun 2025); 28 Feb 2026 attacks; Iran's 20 Nov 2025 letter ending the Cairo agreement. All match.
- UK House of Commons Library CBP-10521 (24 Apr 2026): strikes began 28 Feb 2026; conditional ceasefire 8 Apr 2026. Match.
- CRS IF12106 (updated 13 Oct 2026): "The status of Iran's nuclear program is unclear."; June 2026 US–Iran MOU no-weapons clause. Match.
- Fixes applied by chat: China test rows moved from the mail. mirror to the registered canonical URL (nuclearweaponarchive.org); North Korea first test now cites CTBTO (date) and NORSAR (around 1 kt); the ODNI 2006 release survives only as a govdocs1-corpus copy and is a candidate, not a citation.

## Counts (verified / candidate / gap)
World 13/1/0 · United States 40/0/1 · Russia 48/2/0 · United Kingdom 24/0/1 · France 33/1/0 · China 36/2/0 · India 34/0/2 · Pakistan 30/1/1 · North Korea 33/2/1 · Israel 24/0/0 · Iran 41/1/0

## Per country
- United States: FAS/SIPRI split; every row of the 2026 Nuclear Notebook Table 1. Trinity 16 Jul 1945, 21 kt (24.8 ± 2 kt in LANL's 2021 reassessment). Last test Divider, 23 Sep 1992; 1,054 tests (DOE/NV-209). NPT and CTBT dates.
- Russia: FAS/SIPRI split; full 2026 Table 1. 715 tests (official Russian catalogue via Sublette); first 29 Aug 1949 at Semipalatinsk, 22 kt; last 24 Oct 1990. CTBT ratified 2000; withdrawal effected 3 Nov 2023 (UN C.N.463.2023).
- United Kingdom: SIPRI Jan 2026 Trident row and the 2024 Notebook. 45 tests (24 joint at the Nevada Test Site); Hurricane 3 Oct 1952, about 25 kt; last test 26 Nov 1991 (name not captured).
- France: per-system rows from SIPRI's Jan 2026 table (the 2025 Notebook table is an image). 210 tests; Gerboise bleue 13 Feb 1960, 70 kt (OPECST report); last test 27 Jan 1996. Inventory 370 = 290 stockpile + up to 80 retired.
- China: full 2026 Table 1. "596", 16 Oct 1964, Lop Nur, 22 kt. Last test 29 Jul 1996 (China's statement, IAEA INFCIRC/522). Total tests: 45 or 47 depending on the source.
- India: full 2026 Table 1; SIPRI shows 12 deployed warheads (first time). 18 May 1974 Pokhran test; 1998: three tests on 11 May, two sub-kiloton tests on 13 May (Government of India paper). No source states a total.
- Pakistan: systems, ranges, NASIC "fewer than 50" launchers for Ghauri and Shaheen-II. Tests 28 and 30 May 1998 (claimed counts vs CTBTO's count). Per-system warhead split exists only as a table image.
- North Korea: six tests at Punggye-ri; first 9 Oct 2006 (CTBTO), around 1 kt (NORSAR); last 3 Sep 2017, about 250 kt (NORSAR). Hwasong-15, -17, -18 likely operational (CRS 13 Oct 2026); CRS: postured for a seventh test. NPT withdrawal announced 10 Jan 2003. Launcher counts: FAS says unclear.
- Israel: 90 warheads. Delivery data from SIPRI's Jan 2024 table; the latest Israel Notebook is Jan 2022. Testing: no confirmed test.
- Iran: no nuclear weapons (FAS, SIPRI). NPT ratified 2 Feb 1970; CTBT signed, not ratified. IAEA has no access to the attacked sites and cannot state the stockpile's current size or location; continuity of knowledge lost since June 2025. June 2025 attacks 13–24 Jun (US strikes 22 Jun). Cooperation-suspension law 2 Jul 2025; Cairo understanding 9 Sep 2025, voided 20 Nov 2025. Snapback: E3 notice 28 Aug 2025; 26 Sep vote failed (9 against, 4 for, 2 abstentions); measures from the evening of 27 Sep 2025. 2026: US–Israel strikes from 28 Feb (Natanz entrance buildings, Bushehr site, Khondab heavy-water plant); conditional ceasefire 8 Apr; Bushehr inspection 1–3 Jun 2026; Board resolution GOV/2026/61 (9 Sep 2026); June 2026 US–Iran MOU (only its no-weapons clause verified).

## Conflicts
- FAS vs SIPRI: same authors, no disagreeing numbers. India: SIPRI 12 deployed; the FAS India row prints 0 deployed + 178 reserve against a 190 stockpile (does not add up; the FAS total includes the 12).
- Test counts: China 45 vs 47; India and Pakistan May 1998 ("five nuclear tests" per CTBTO vs declared 5 and 6); the 24 joint US–UK tests are in both the US 1,054 and the UK 45.
- FAS page history paragraph says 12,321; its own table says 12,187. Use the table.

## Live hub (/nuclear-weapons-by-country) problems to fix in wave 1
- Says Russia "operates" the Sarmat; the 2026 Table 1 shows no Sarmat launchers or warheads, and the sentence is uncited.
- Calls every non-deployed warhead a "reserve"; 2,442 are retired awaiting dismantlement.
- China "more than 1,000 by 2030" vs the FAS footnote "about 1,000"; match the cited source's wording.
- Early-2026 numbers cite the SIPRI 2023 and 2024 yearbooks; cite SIPRI Yearbook 2026 ch. 8.
- Uncited claims: China's motivation, Dreadnought timing, UK/France stockpile-cap increases, India's no-first-use, Pakistan's tactical-weapons policy, "amimut", "likely North Korean buildup". Cite or cut.
- research/facts-verified.csv row 212 note says Russia revoked CTBT ratification 8 Nov 2023; the UN notice says effected 3 Nov 2023 (8 Nov is the notice date). The live glossary text has no date; fix the note.

## Gaps and treatment
- Pakistan warheads per system: reshape to systems and ranges (per-system split is an image).
- North Korea launcher counts: disclose ("FAS: unclear").
- Israel delivery data dated Jan 2024: disclose the date.
- China test total: show 45 and 47 with sources, or omit the total.
- India test total: list the dated events instead.
- Cut: last-test yields (US, France, China); test names not captured (UK last test, Soviet first test, India 1974); France's 50/160 split (candidate); North Korea "10–20 kt" (context unconfirmed); Iran MOU terms beyond the no-weapons clause.

## Registry checker
check_sources.py fails on the committed page map (125 violations) because page-map.csv's data_source column is free text ("arsenals-2026 (FAS …; SIPRI …)") instead of registry domain keys. Normalized to leading keys: 23 violations, none on the hub or country pages (19 pages point at "sources.ts", 3 at a source id, 1 at "GAP:"). The 9 new rows alone: OK. Normalize the page map before the build.

## Access notes
Blocked or unreadable: French Senate report 179 and the France table image; OSTI DOE/NV-209 Rev. 16 and congress.gov CRS pages (CRS read via EveryCRSReport); House of Commons briefing CBP-10637; the CEA/DAM PDF; the Soviet test catalogue and UK NPT depositary list (scans). DOE/NV-209 Rev. 15 text ends before 1992; the SIPRI 2026 chapter text ends before the China, India, Pakistan, North Korea and Israel tables. IAEA Iran reports and the 7 Sep 2026 DG statement are Iran Watch copies; no iaea.org originals found.
