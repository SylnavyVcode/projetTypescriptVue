export const renderTimeEntriesAction = ({ dateStart, entries, actions }) => {
  const report = [];

  //========================INIT PAGE ==============

  if (actions.length <= 0) {
    const model = {
      action: {
        libelle: "init page load",
        date: dateStart,
      },
      entries: entries.filter(function (el) {
        return (
          new Date(dateStart).getTime() < new Date(el.startedDateTime).getTime()
        );
      }),
    };
    //report push
    report.push(model);
  } else {
    // init page

    const model = {
      action: {
        libelle: "init page load",
        date: dateStart,
      },
      entries: entries.filter(function (el) {
        return (
          new Date(dateStart).getTime() <
            new Date(el.startedDateTime).getTime() &&
          new Date(el.startedDateTime).getTime() <
            new Date(actions.stats.start).getTime() + actions.tests[0].duration
        );
      }),
    };
    report.push(model);

    //================================= ACTION ==========================

    actions.tests.forEach(function (element, index) {
      //verification du non depassement de l'index

      if (index <= actions.tests.length) {
        if (typeof actions.tests[index + 1] == "undefined") {
          //console.log("und...");
          return;
        } else {
          // console.log(new Date(actions.stats.start).getTime() + element.duration);

          // const respo= new Date(actions.stats.start).getTime() + element.duration

          // console.log(new Date(respo).toISOString());

          const model = {
            action: {
              date: new Date(
                new Date(actions.stats.start).getTime() + element.duration
              ).toISOString(),
              libelle: element.title,
              duration: element.duration,
              speed: element.speed,
              err: element.err,
            },
            entries: entries.filter(function (el) {
              return (
                new Date(actions.stats.start).getTime() + element.duration <
                  new Date(el.startedDateTime).getTime() &&
                new Date(actions.stats.start).getTime() + element.duration <
                  new Date(actions.stats.start).getTime() +
                    actions.tests[index + 1].duration
              );
              // < (new Date(actions.stats.start).getTime()+ actions.tests[index + 1].duration );
            }),
          };
          report.push(model);
        }
      } else {
        const model = {
          action: {
            date: new Date(actions.stats.start).getTime() + element.duration,
            libelle: element.title,
            duration: element.duration,
            speed: element.speed,
            err: element.err,
          },
          entries: entries.filter(function (el) {
            return (
              new Date(actions.stats.start).getTime() + element.duration <
              new Date(el.startedDateTime).getTime()
            ); // && ((new Date(actions.stats.start).getTime() + element.duration) < (new Date(actions.stats.start).getTime()+ actions.tests[index + 1].duration))
          }),
        };

        report.push(model);
      }
    });
  }

  return report;
};

export const renderTimeEntriesPage = ({ dateStart, entries, pages }) => {
  /**
   * report arrays
   */
  const report = [];

  //============LOAD TIME ==============

  pages.forEach((site, index) => {
    if (typeof pages[index + 1] == "undefined") {
      const model = {
        path: site.url,
        date: site.start,
        entries: entries.filter(function (el) {
          return site.start < new Date(el.startedDateTime).getTime();

          //return (new Date(site.start).getTime() + el.duration) < new Date(el.startedDateTime).getTime() && ((new Date(site.start).getTime() + el.time) < (new Date(site.start).getTime()+ pages[index + 1].duration)) // < (new Date(actions.stats.start).getTime()+ actions.tests[index + 1].duration );
        }),
      };

      report.push(model);
    } else {
      const model = {
        path: site.url,
        date: site.start,
        entries: entries.filter(function (el) {
          return (
            site.start + new Date(dateStart).getTime() <
            new Date(el.startedDateTime).getTime() +
              new Date(dateStart).getTime() <
            pages[index + 1].start
          );

          //return (new Date(site.start).getTime() + el.duration) < new Date(el.startedDateTime).getTime() && ((new Date(site.start).getTime() + el.time) < (new Date(site.start).getTime()+ pages[index + 1].duration)) // < (new Date(actions.stats.start).getTime()+ actions.tests[index + 1].duration );
        }),
      };

      report.push(model);
    }
  });

  return report;
  //============END LOAD TIME ==========
};

//pourcentage de chaque tag retrouvé
export const renderTagPercent = () => {};
