// @ts-ignore
// import Quagga from './quagga.min.js'; // ES6
import { QuaggaJSStatic } from "@ericblade/quagga2"; // ES6

declare let Quagga: QuaggaJSStatic;

const ui = document.getElementById("ui")!;
const startButton = document.getElementById("startButton")!;
const stopButton = document.getElementById("stopButton")!;
const barcodeType = document.getElementById(
  "barcodeType"
)! as HTMLSelectElement;
const resultInput = document.getElementById("resultInput")! as HTMLInputElement;
const log = document.getElementById("log")! as HTMLTextAreaElement;

const screen = document.getElementById("screen")!;

function init() {
  function show() {
    ui.classList.add("hidden");
    screen.classList.remove("hidden");
  }
  function hide() {
    ui.classList.remove("hidden");
    screen.classList.add("hidden");
  }

  startButton.onclick = () => {
    log.value += "start.\n";

    show();

    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#screen")! // Or '#yourElement' (optional)
        },
        decoder: {
          readers: [barcodeType.value]
        }
      },
      function (err) {
        if (err) {
          console.log(err);
          log.value += err + "\n";

          alert("barcode reader failed to initialize.");
          Quagga.stop();
          hide();
          return;
        }
        console.log("Initialization finished. Ready to start");
        log.value += "initialized.\n";
        Quagga.start();
      }
    );

    Quagga.onProcessed(function (result) {
      log.value += "processed.\n";
      log.value += JSON.stringify(result) + "\n";

      const ctx = Quagga.canvas.ctx.overlay;
      const canvas = Quagga.canvas.dom.overlay;

      ctx.clearRect(0, 0, Math.trunc(canvas.width), Math.trunc(canvas.height));

      if (result) {
        if (result.box) {
          log.value += JSON.stringify(result.box) + "\n";

          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, ctx, {
            color: "blue",
            lineWidth: 2
          });
        }
      }
    });

    Quagga.onDetected(function (result) {
      log.value += "onDetected.\n";
      resultInput.value = result.codeResult.code!;

      Quagga.stop();
      hide();
    });
  };

  stopButton.onclick = () => {
    log.value += "stop button pressed.\n";
    Quagga.stop();
    hide();
  };
}

init();
