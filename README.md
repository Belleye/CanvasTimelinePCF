# CanvasTimelinePCF

CanvasTimelinePCF is a custom Power Apps component framework (PCF) control based on the vis-timeline library. It allows users to visualize and interact with time-based data within Power Apps Canvas.

## Demo

Watch the demo on YouTube: [CanvasTimelinePCF Demo](https://youtu.be/7gNuLQXbtyo)

## Quick Installation Guide

Watch the speed run installation of the PCF on YouTube: [Speed Run Install PCF](https://youtu.be/s5nrKmNX5JI)

## Features

- Interactive timeline visualization
- Customizable item styles
- Integration with Power Apps Canvas

## Build From Source

### Prerequisites

- Node.js
- Power Apps CLI

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd CanvasTimelinePCF
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Development

To start the development server:
```
npm start watch
```

To build the project:
```
npm run build
```

### Deployment

To push the control to Power Apps:
```
pac pcf push
```

I've not found a reliable method for exporting to zip file (vsCode and PA CLI), currently terminating publishing before file clean up to get the zip package.

## Usage

After deployment, add the CanvasTimelinePCF control to your Power Apps Canvas and bind it to your data source.<br>
Settings>Display>Scale to fit: off


## Contributing

Contributions are welcome. <br>
We need:<br>
- Someone with Github experience
- Someone with better typescript skills than me :/


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [vis-timeline](https://visjs.github.io/vis-timeline/docs/timeline/) library for providing the foundational timeline functionality.
- [cursor.sh](https://cursor.sh/) Best IDE
- [Scott Durow](https://www.youtube.com/c/ScottDurow)

## Connect
[LinkedIn](www.linkedin.com/in/stephen-belli-7a9300a5)