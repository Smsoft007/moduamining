// var config = {
//     container: "#basic-example",
//     //animateOnInit: true,
//     connectors: {
//       type: 'curve', //bCurve,curve,step,straight
//       style: {
//         "stroke-width": 1
//       }
//     },
//     animateOnInit: true,
//     node: {
//       HTMLclass: 'nodeExample1',
//       collapsable: true
//     },
//     animation: {
//       nodeAnimation: "easeOutBounce",
//       nodeSpeed: 700,
//       //connectorsAnimation: "bounce",
//       connectorsSpeed: 700
//     }
//   },
//   ceo = {
//     text: {
//       name: "Mark Hill",
//       title: "Chief executive officer",
//       contact: "Tel: 01 213 123 134",
//       desc: "A basic example",
//     },
//     HTMLclass: 'blue',
//     image: "images/2.jpg",
//   },
//
//   cto = {
//     parent: ceo,
//     text: {
//       name: "Joe Linux",
//       title: "Chief Technology Officer",
//     },
//     stackChildren: true,
//     image: "images/1.jpg"
//   },
//   cbo = {
//     parent: ceo,
//     stackChildren: true,
//     text: {
//       name: "Linda May",
//       title: "Chief Business Officer",
//     },
//     HTMLclass: 'blue',
//     image: "images/5.jpg"
//   },
//   cdo = {
//     parent: ceo,
//     text: {
//       name: "John Green",
//       title: "Chief accounting officer",
//       contact: "Tel: 01 213 123 134",
//     },
//     image: "images/6.jpg"
//   },
//   cio = {
//     parent: cto,
//     text: {
//       name: "Ron Blomquist",
//       title: "Chief Information Security Officer"
//     },
//     image: "images/8.jpg"
//   },
//   ciso = {
//     parent: cto,
//     text: {
//       name: "Michael Rubin",
//       title: "Chief Innovation Officer",
//       contact: {
//         val: "we@aregreat.com",
//         href: "mailto:we@aregreat.com"
//       }
//     },
//     image: "images/9.jpg"
//   },
//   cio2 = {
//     parent: cdo,
//     text: {
//       name: "Erica Reel",
//       title: "Chief Customer Officer"
//     },
//     link: {
//       href: "http://www.google.com"
//     },
//     image: "images/10.jpg"
//   },
//   ciso2 = {
//     parent: cbo,
//     text: {
//       name: "Alice Lopez",
//       title: "Chief Communications Officer"
//     },
//     image: "images/7.jpg"
//   },
//   ciso3 = {
//     parent: cbo,
//     text: {
//       name: "Mary Johnson",
//       title: "Chief Brand Officer"
//     },
//     image: "images/4.jpg"
//   },
//   ciso4 = {
//     parent: cbo,
//     text: {
//       name: "Kirk Douglas",
//       title: "Chief Business Development Officer"
//     },
//     image: "images/11.jpg"
//   }
//
// chart_config = [
//   config,
//   ceo,
//   cto,
//   cbo,
//   cdo,
//   cio,
//   ciso,
//   cio2,
//   ciso2,
//   ciso3,
//   ciso4
// ];




// Another approach, same result
// JSON approach


var chart_config = {
  chart: {
    container: "#basic-example",
    //animateOnInit: true,
    connectors: {
      type: 'curve', //bCurve,curve,step,straight
      style: {
        "stroke-width": 1
      }
    },
    animateOnInit: true,
    node: {
      HTMLclass: 'nodeExample1',
      collapsable: true
    },
    animation: {
      nodeAnimation: "easeOutBounce",
      nodeSpeed: 700,
      //connectorsAnimation: "bounce",
      connectorsSpeed: 700
    }
  },
  nodeStructure: {
    text: {
      name: "Mark Hill",
      title: "Chief executive officer",
      contact: "Tel: 01 213 123 134",
    },
    image: "images/2.jpg",
    children: [{
        text: {
          name: "Joe Linux",
          title: "Chief Technology Officer",
        },
        stackChildren: true,
        image: "images/1.jpg",
        children: [{
            text: {
              name: "Ron Blomquist",
              title: "Chief Information Security Officer"
            },
            image: "images/8.jpg"
          },
          {
            text: {
              name: "Michael Rubin",
              title: "Chief Innovation Officer",
              contact: "we@aregreat.com"
            },
            image: "images/9.jpg"
          }
        ]
      },
      {
        stackChildren: true,
        text: {
          name: "Linda May",
          title: "Chief Business Officer",
        },
        image: "images/5.jpg",
        children: [{
            text: {
              name: "Alice Lopez",
              title: "Chief Communications Officer"
            },
            image: "images/7.jpg"
          },
          {
            text: {
              name: "Mary Johnson",
              title: "Chief Brand Officer"
            },
            image: "images/4.jpg"
          },
          {
            text: {
              name: "Kirk Douglas",
              title: "Chief Business Development Officer"
            },
            image: "images/11.jpg"
          }
        ]
      },
      {
        text: {
          name: "John Green",
          title: "Chief accounting officer",
          contact: "Tel: 01 213 123 134",
        },
        image: "images/6.jpg",
        children: [{
          text: {
            name: "Erica Reel",
            title: "Chief Customer Officer"
          },
          link: {
            href: "http://www.google.com"
          },
          image: "images/10.jpg"
        }]
      }
    ]
  }
};
