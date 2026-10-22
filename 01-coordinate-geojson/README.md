# Coordinate Bounding Box & GeoJSON Generator

## Overview

A lightweight browser-based tool for creating geographic bounding boxes, visualizing coordinate ranges on an interactive map, and exporting the results as GeoJSON.

This project demonstrates a practical approach to simplifying coordinate-related tasks using accessible web technologies rather than relying on a dedicated GIS platform.

## Business Context

In operational workflows involving geographic data, coordinate ranges may need to be entered, checked, visualized, and transferred into spreadsheets.

This tool was designed to make those steps more straightforward by combining coordinate input, interactive map visualization, rectangle drawing, and data export in one interface.

The approach reflects a practical problem-solving mindset: using lightweight tools to address specific workflow needs under budget constraints.

## Features

- **Coordinate input:** Enter northeast and southwest coordinates using latitude and longitude.
- **Map visualization:** Display the selected geographic area on an interactive map.
- **Interactive rectangle drawing:** Draw a rectangle on the map to define a geographic area.
- **Automatic coordinate extraction:** Populate the coordinate fields from a drawn rectangle.
- **GeoJSON generation:** Generate a GeoJSON Polygon representing the selected bounding box.
- **Clipboard support:** Copy GeoJSON output or coordinate values for use in spreadsheets.

## Technologies

- HTML
- CSS
- JavaScript
- Leaflet
- Leaflet.draw
- GeoJSON

## How to Use

1. Open `index.html` in a web browser.
2. Enter the northeast and southwest coordinates, or draw a rectangle on the map.
3. Display the selected area on the map.
4. Generate the GeoJSON output.
5. Copy the generated data for use in other applications.

An internet connection is required to load the external mapping libraries and map tiles.

## Connection to My Experience

In a previous business operations role, I used SQL to join, clean, and validate golf-course latitude and longitude data.

This project demonstrates a related practical skill: making coordinate data easier to visualize, organize, and transfer between tools. It does not represent advanced GIS analysis or complex spatial calculations.

## Scope and Limitations

- Designed for basic rectangular bounding boxes.
- Does not replace a full GIS platform.
- Does not perform advanced spatial analysis.
- Depends on external mapping libraries and map tile services.
- Coordinate inputs should be validated before being used in business-critical workflows.
