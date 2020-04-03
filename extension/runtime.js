'use strict';

const onMacintosh = () => {
  return /Macintosh/.test(navigator.userAgent)
};

const redirect = (url) => window.location.href = url;

function $(html) {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  return wrapper.firstChild;
}

class Route {
  constructor(url, routeTo) {
    this.matcher = url;
    this.destination = routeTo;
  }
  dispatch() {
    let [controllerName, action] = this.destination.split("#");
    controllerName = `${controllerName}Controller`;
    eval(`new ${controllerName}().${action}({match:this._lastMatch})`);
    this._lastMatch = null;
  }
  // TODO: more complex matchers
  match(location) {
    // regex matchers
    if (typeof this.matcher === "object") {
      let match = location.pathname.match(this.matcher);
      if (match) {
        this._lastMatch = match;
        return true
      }
    } else {
      return location.pathname === this.matcher
    }
  }
}

class Router {
  constructor() {
    this.table = [];
  }
  go(location) {
    let route = this.table.find((route) => route.match(location));
    if (route)
      route.dispatch();
  }
  get(url, routeTo) {
    this.table.push(new Route(url, routeTo));
  }
  static get app() {
    return new Proxy(() => {}, {
      apply: function(obj) {
        return `${obj.controller}#${obj.action}`
      },
      get: function(obj, prop,receiver) {
        if (prop[0] === prop[0].toUpperCase()) {
          obj.controller = `${prop}`;
        } else {
          obj.action = prop;
          // return `${obj.controller}#${obj.action}`
        }
        // console.log(`${obj.controller}#${obj.action}`)
        // console.log(receiver)
        return receiver
      }
    } )
  }
}

const cleanupBreadcrumbs = () => {
    let breadcrumbs = document.querySelector("nav.breadcrumb");
    if (!breadcrumbs) return;

    let links = breadcrumbs.querySelectorAll("a");
    // ugh, what's the point of a single breadcrumb that points to our current page?
    if (links.length === 1) {
        breadcrumbs.remove();
    }
};

const addNewSolutionsMenuLink = () => {
    let dashboard = document.querySelector('.dropdown a[href*="/mentor/dashboard"]');
    dashboard.insertAdjacentElement('afterend',
        $("<li><a href='/mentor/dashboard/next_solutions'>Queue</a></li>"));
};



const LEGAL = `
<div class="legal">
Exercism Plus is a <a href="https://github.com/yyyc514/exercism_plus">tiny little extension</a>,
devoted to helping improve your Exercism experience, and supported by
<a href="https://github.com/yyyc514/exercism_plus/graphs/contributors">2 wonderful contributors</a>.
</div>
`;

const addFooter = () => {
    let legal = document.querySelector("footer .legal");
    if (!legal) return;

    legal.insertAdjacentElement('beforebegin',$(LEGAL));
    legal.style.marginTop=0;
};

// TODO: Add settings panel
const config = {
    // provide the option to configure via manual using localStorage
    // in Chrome console for now

    // soon we'll do this with profile info so this will go away completely
    realname: window.localStorage.getItem("_ep_realname")
  };

const whoami = () => {
    let person = document.querySelector(".logged-in .dropdown .person strong");
    return person && person.innerHTML
};

const useRealNames = () => {
    document.querySelectorAll(".post-body .user-handle").forEach((el) => {
        let role = el.parentNode.querySelector(".user-role");
        if (el.innerHTML === whoami()) {
            el.innerHTML = config.realname || whoami();
            role.remove();
        }
        // there is only a single student it's hard to get confused about who that is
        // But don't remove the role if we're looking at someone else's review.
        if (role && role.innerHTML.trim()==="Student" && el.innerHTML !== "[Redacted]") {
            role.remove();
        }
        if (el.innerHTML === "Automated Message") {
            el.innerHTML = "Exercism";
        }
    });
};

const addPopoutToggleButton = () => {
    let tabs = document.querySelector(".new-editable-text .tabs");
    let btn = $(`<i title="Pop-out editor" aria-hidden="true" class="pop far fa-window-restore"></i>`);
    tabs.insertAdjacentElement("beforeend",btn);
    btn.addEventListener("click",(ev) => {
        togglePopoutEditor();
    });

};

const togglePopoutEditor = () => {
    let editor = document.querySelector(".new-editable-text");
    let rhs = document.querySelector(".rhs .discussion");

    editor.classList.toggle("popout");
    if (editor.classList.contains("popout")) {
        editor.style.width = `${rhs.clientWidth}px`;
    } else {
        editor.style.width = null;
    }
};

const cleanupPostsTimestamps = () => {
    document.querySelectorAll(".post-body .created-at").forEach((el) => {
        el.innerHTML = el.innerHTML.replace(/posted|about/g,"");
    });
};
const renameLeaveButton = () => {
    if (document.querySelector("a.leave-button"))
        document.querySelector("a.leave-button").innerHTML="Leave Discussion";
};

const getEditor = () => document.querySelector('textarea.md-input[name="discussion_post[content]"]');

const fixEditorKeystrokes = () => {
    if(!getEditor()) return;

    let editors = document.querySelectorAll('textarea[name="discussion_post[content]"]');

    editors.forEach((editor) => {
      editor.addEventListener("keydown", (event) => {
        let click = new MouseEvent('click', { bubbles: true});
        if (event.metaKey && event.key=="b") {
          let boldButton = editor.parentNode.querySelector('button[data-hotkey="Ctrl+B"]');
          boldButton.dispatchEvent(click);
        }
        if (event.metaKey && event.key=="i") {
          let italicButton = editor.parentNode.querySelector('button[data-hotkey="Ctrl+I"]');
          italicButton.dispatchEvent(click);
        }
      });
    });

  };

/* higher level HTTP abstractions */

const get = async (url, opts = {}) => {
  try {
    console.time(`REQ: ${url}`);
    let resp = await fetch(url, opts);
    let blob = await resp.blob();
    let html = await blob.text();
    console.timeEnd(`REQ: ${url}`);
    return html
  }
  catch(error) {
    console.log(error);
    return null
  }

};

// move to utility?
const trimBody = (html) => {
  let start = html.indexOf("<body");
  html = html.slice(start);
  let end = html.indexOf("</body>");
  return html.slice(0,end+7)
};

const db = localStorage;

class User {
  constructor(data) {
    Object.assign(this, data);
  }

  get sidebar() {
    let dom = $(this.profileHTML);
    return dom.parentNode.querySelector(".sidebar")
  }

}
class Users {

  static find(id) {
    let item;
    if (item = db.getItem(`users/${id}`)) {
      console.log(`CACHE: User[${id}]`);
      console.log(item);
      return new User(JSON.parse(item))
    }
  }

  static async get(id) {
    let user = this.find(id);
    if (user) return user

    let html = await get(`https://exercism.io/profiles/${id}?track_id=999`);
    if (!html) return null

    return this.fromHTML(html, {userId: id})
  }

  static persist(user) {
    user.saveAt = new Date();
    db.setItem(`users/${user.id}`,JSON.stringify(user));
  }

  static fromHTML(html, {userId}) {
    html = trimBody(html);

    // todo handle sidebar not found

    let user = new User({
      id: userId,
      profileHTML: html,
      syncAt: new Date()
    });

    return user
  }
}

class MentorSolutionView {
  stickyLeftSide() {
    let panes = document.querySelector("#mentor-solution-page .lhs .tabs-and-panes");

    const doSticky = () => {
      let windowHeight = window.innerHeight;
      let height = panes.offsetHeight;
      if (windowHeight > height) {
        panes.classList.add("stickySubmission");
      } else {
        panes.classList.remove("stickySubmission");
      }
      // HACK: because of bug in Exercism tabs.js implementation
      panes.className = panes.className.replace(/^(.*)\b(selected-\d)\b(.*)$/,"$1 $3 $2");
    };
    doSticky();
    // every time a tab is clicked we need to rethink our stickiness because
    // the height of the content can change
    panes.addEventListener("click", doSticky);
  }

  async render() {

    this.stickyLeftSide();
    addPopoutToggleButton();

    let profileLink = document.querySelector("#mentor-solution-page .track-header .byline a");
    if (!profileLink) return;

    let userid = profileLink.innerHTML;
    let user = await Users.get(userid);
    Users.persist(user);
    let sidebar = user.sidebar;

    if (sidebar.querySelector(".badge.mentor")) {
      sidebar.querySelector(".name").classList.add("mentor");
    }
    sidebar.querySelectorAll(".badge").forEach((badge) =>
      badge.innerHTML = badge.innerHTML.replace("mentor",""));

    // if discussion is immediately under rhs then there is an ongoing visible discussion
    // otherwise this might not be claimed yet
    let discussion = document.querySelector(".rhs > .discussion") || document.querySelector(".claimed-section");
    console.log(discussion);
    discussion.insertAdjacentElement("beforebegin", sidebar);
    if (discussion.classList.contains("discussion")) {
      discussion.querySelector("h3").innerHTML="Discussion";
      sidebar.insertAdjacentElement("afterbegin",$("<h4>Who you're mentoring</h4>"));
    } else {
      sidebar.insertAdjacentElement("afterbegin",$("<h4>Who you'll be mentoring</h4>"));
    }
  }
}

const TIPS = [
    [/[A-Z]{5}/, "Don't YELL at your students, try bold or italics instead."],
    [/\b(never|always)\b/i, "Try not to speak in absolutes."],
    [/\b(no one|nobody)\b/i, "Try not to speak in absolutes."],
    [/\bjust\b/,"&quot;just&quot; can come across as insulting for some."],
    [/\breally\b/i,"Is really <i>really</i> necessary?"],
    [/\byou do not\b/i,"Try speaking more suggestively, less imperatively."],
    [/\byou don't\b/i,"Try speaking more suggestively, less imperatively."],
    [/\byou need\b/i,"Try speaking more suggestively, less imperatively."],
    [/\byou\b/i,"Is it them, or is it the code?  Avoid 'you' if possible."],
    [/\byour code\b/i, "Try <i>the code</i> vs <i>your code</i>, make it less personal."],
    [/\bi think\b/i, "You think? Is there a way to sound less uncertain?"],
  ];

  const CODE_BLOCK_SNIPPET_RE = /```[\s\S]*?```/g;
  const INLINE_CODE_RE = /`.*?`/g;
  const QUOTED_RE = /^>.*$/m;

  class ContentParser {
    constructor(text) {
      this.text = text;
    }
    textualContent() {
      let text = this.text
        .replace(CODE_BLOCK_SNIPPET_RE,"")
        .replace(INLINE_CODE_RE,"")
        .replace(QUOTED_RE,"")
        .trim();
      return text
    }
  }

  const editorTips = () => {
    let editor = getEditor();
    let markdownPane = document.querySelector('.pane.markdown');
    let tips = markdownPane.insertAdjacentElement('afterbegin',$("<ul></ul>"));
    editor.closest("form").addEventListener("submit", (event) => {
      tips.innerHTML="";
      if (editor._tipTimer) {
        clearTimeout(editor._tipTimer);
        editor._tipTimer = null;
      }
    });
    editor.addEventListener("keyup", (event) => {
      if (editor._tipTimer)
        return;

      // we only fire every 500ms, should be responsive enough
      editor._tipTimer = setTimeout(() => {
        editor._tipTimer = null;
        let text = new ContentParser(editor.value).textualContent();
        tips.innerHTML="";
        for (let [matcher,suggestion] of TIPS) {
          if (matcher.test(text)) {
            tips.appendChild($(`<li>${suggestion}</li>`));
          }
        }
      },500);
    });
  };

const NOT_PUBLIC_TEXT = "solution is not public";

class MentorController {
  constructor() {
  }
  solution({match}) {
    if (onMacintosh())
      fixEditorKeystrokes();

    useRealNames();
    editorTips();
    cleanupPostsTimestamps();
    renameLeaveButton();
    new MentorSolutionView().render();
  }
  solution_not_public({match}) {
    if (document.body.innerHTML.includes(NOT_PUBLIC_TEXT)) {
      redirect(`/mentor/solutions/${match.groups.id}`);
    }
  }
}

const renameDashboardTabs = () => {
    let waiting = document.querySelector('.header-tab[href="/mentor/dashboard/your_solutions"]');
    let queue = document.querySelector('.header-tab[href="/mentor/dashboard/next_solutions"]');
    if (!waiting) return;

    queue.innerHTML = queue.innerHTML.replace(/.*(\(\d+\))/,
        "Queue $1");
    waiting.innerHTML = waiting.innerHTML.replace(/.*(\(\d+\))/,
        "Mentoring $1");
};

const collapseCoreExercises = () => {
    document.querySelectorAll("ul.exercises li a.label").forEach(el => {
        if (el.innerHTML.includes("· 0"))
        el.parentNode.removeChild(el);
        el.innerHTML= el.innerHTML.replace(/\d+\. /,"").replace(" · 0","");
    });
};

const cleanupSolutionList = () => {
    document.querySelectorAll(".solution .details .extra .submitted-at").forEach((el) => {
        el.innerHTML = el.innerHTML.replace(/for mentoring|about/g,"");
    });
    document.querySelectorAll(".solution .details .iteration").forEach((el) => {
        let handle = el.parentNode.parentNode.querySelector(".title .handle");
        handle.remove();
        let user = handle.innerHTML.replace("'s","");
        el.innerHTML = `${el.innerHTML} by ${user}`;
    });
  };

class DashboardController {
  constructor() {
    renameDashboardTabs();
  }

  next_solutions() {
    collapseCoreExercises();
    cleanupSolutionList();
  }
  your_solutions() {
    cleanupSolutionList();
  }
  testimonials() {

  }
}

const keybindings = () => {
  // todo abstract way more later
  document.addEventListener("keyup", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;

    if (event.target.tagName=="INPUT") return;
    if (event.target.tagName=="TEXTAREA") return;

    if (event.key==="n") {
      redirect("/mentor/dashboard/next_solutions");
    }
    if (event.key===";") {
      redirect("/my/notifications");
    }
    if (event.key==="w") {
      document.body.classList.toggle("doublewide");
    }
    if (event.key==="/") {
      togglePopoutEditor();
    }
    // console.log(ev)
  });

};

const router = new Router();
let app = Router.app;

// dashboard
router.get("/mentor/dashboard/next_solutions", app.Dashboard.next_solutions());
router.get("/mentor/dashboard/your_solutions",app.Dashboard.your_solutions());
router.get("/mentor/dashboard/testimonials",app.Dashboard.testimonials());

// solutions
router.get(/^\/solutions\/(?<id>[a-z0-9]+$)/,app.Mentor.solution_not_public());
router.get(/^\/mentor\/solutions\/(?<id>[a-z0-9]+$)/,app.Mentor.solution());



const boot = async () => {
  keybindings();

  addNewSolutionsMenuLink();
  addFooter();
  cleanupBreadcrumbs();

  router.go(location);
};

document.addEventListener("DOMContentLoaded", () => {
  boot();
});
