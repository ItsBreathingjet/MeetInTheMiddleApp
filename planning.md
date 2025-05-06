# MeetInTheMiddle - AI Prompt Examples

## Initial Project Setup

```
I want to create a web application called "MeetInTheMiddle" that helps users find the perfect midpoint between two locations, displaying restaurants, entertainment venues, and other points of interest at that midpoint location. The app should have:

1. An interactive map interface with route visualization showing the main and alternative paths between locations, with a prominent pin marking the exact midpoint on the navigation route.

2. Dual location input with side-by-side "Location 1" and "Location 2" search boxes with real-time auto-suggestions as users type, supporting both address entry and map pin dropping.

3. A points of interest panel displaying specific venues at the midpoint with clickable listings that open the location in Google Maps.

4. Professional styling with a thoughtful color scheme and engaging animation showing two cars traveling from opposite ends to meet in the middle.

Please help me set up the initial project structure using React, TypeScript, and Vite.
```

## Map Interface Implementation

```
I need to implement the map interface for my MeetInTheMiddle app. I want to use Leaflet for the map display since it's lightweight and works well with React. The map should:

1. Display the two selected locations with distinct markers
2. Show the route between them with the midpoint highlighted
3. Allow zooming and panning
4. Have controls for switching between map types (road and satellite)
5. Display POI markers near the midpoint

Please create a MapInterface component that handles these requirements.
```

## Location Input Component

```
For my MeetInTheMiddle app, I need a LocationInputs component that allows users to enter two different locations. The component should:

1. Have two input fields with autocomplete suggestions as the user types
2. Include "Set" buttons to confirm the locations
3. Display the current set locations below each input
4. Handle geocoding to convert addresses to coordinates
5. Show appropriate error messages if locations can't be found

Please create this component using React and TypeScript.
```

## Points of Interest Panel

```
I need a PointsOfInterestPanel component for my MeetInTheMiddle app that displays venues near the calculated midpoint. The panel should:

1. Categorize POIs into tabs (All, Restaurants, Entertainment, Cafes, Other)
2. Display each POI in a card format with image, name, rating, and distance
3. Include a search box to filter POIs by name or type
4. Show a loading state while fetching POIs
5. Handle empty states gracefully

Please implement this component using React, TypeScript, and Tailwind CSS.
```

## Current Location Feature

```
Can you also next to the "set" location buttons add a button so the user can use their current location to set it?
```

## Geolocation Fix

```
When I try to click the current location button it just says it can't retrieve the location. I did not even get a message from Microsoft Edge which is the browser I'm using in order to ask if it can use my location. Can you fix this?
```

## Project Documentation

```
Complete code and files pushed to GitHub

A README.md file (AI-generated) that includes:

Project title and description

Functional documentation

Visuals or diagrams (ask AI to create and/or add them to your readme.md file)

A PDF named _prompts.pdf containing examples of the prompts you used to build the project

A markdown file named _planning.md with all AI-generated non-code content (requirements, personas, system design, use cases, etc.)

Link(s) to any live version of the product (if applicable)
``` "https://tempo-deployment-385fc71b-19e3-47da-935c-fd43d9b9b1f-grusoa2ly.vercel.app/"