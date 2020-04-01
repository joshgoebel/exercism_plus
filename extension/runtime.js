'use strict';

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

const onMacintosh = () => {
  return /Macintosh/.test(navigator.userAgent)
};

const redirect = (url) => window.location.href = url;

function $(html) {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  return wrapper.firstChild;
}

// TODO: Add settings panel
const config = {
    username: "ajoshguy",
    realname: "Josh G."
  };

const cleanerUI = () => {
    collapseCoreExercises();
    renameMentorTabs();
    cleanupSolutionList();
    cleanupPostsList();
    addFooter();
    useRealName();
    cleanupBreadcrumbs();
  };

const collapseCoreExercises = () => {
document.querySelectorAll("ul.exercises li a.label").forEach(el => {
    if (el.innerHTML.includes("· 0"))
    el.parentNode.removeChild(el);
    el.innerHTML= el.innerHTML.replace(/\d+\. /,"").replace(" · 0","");
});
};

const renameMentorTabs = () => {
let waiting = document.querySelector('.header-tab[href="/mentor/dashboard/your_solutions"]');
let queue = document.querySelector('.header-tab[href="/mentor/dashboard/next_solutions"]');
if (!waiting) return;

queue.innerHTML = queue.innerHTML.replace(/.*(\(\d+\))/,
    "Queue $1");
waiting.innerHTML = waiting.innerHTML.replace(/.*(\(\d+\))/,
    "Mentoring $1");
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

const cleanupSolutionList = () => {
  document.querySelectorAll(".solution .details .extra .submitted-at").forEach((el) => {
      el.innerHTML = el.innerHTML.replace("for mentoring","");
  });
  document.querySelectorAll(".solution .details .iteration").forEach((el) => {
      let handle = el.parentNode.parentNode.querySelector(".title .handle");
      handle.remove();
      let user = handle.innerHTML.replace("'s","");
      el.innerHTML = `${el.innerHTML} by ${user}`;
      // el.insertAdjacentElement("afterend",$(`<span class='iteration'>by ${user}</span>`))
  });
};

const cleanupPostsList = () => {
document.querySelectorAll(".post-body .created-at").forEach((el) => {
    el.innerHTML = el.innerHTML.replace(/posted|about/g,"");
});
};

const useRealName = () => {
document.querySelectorAll(".post-body .user-handle").forEach((el) => {
    let role = el.parentNode.querySelector(".user-role");
    if (el.innerHTML === config.username) {
    el.innerHTML = config.realname;
    role.remove();
    }
    // there is only a single student it's hard to get confused about who that is
    if (role && role.innerHTML.trim()==="Student") {
    role.remove();
    }
    if (el.innerHTML === "Automated Message") {
    el.innerHTML = "Exercism";
    }
});
};

const cleanupBreadcrumbs = () => {
let breadcrumbs = document.querySelector("nav.breadcrumb");
if (!breadcrumbs) return;

let links = breadcrumbs.querySelectorAll("a");
// ugh, what's the point of a single breadcrumb that points to our current page?
if (links.length === 1) {
    breadcrumbs.remove();
}
};

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
  async render() {
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

    let discussion = document.querySelector(".claimed-section") || document.querySelector(".discussion");
    discussion.insertAdjacentElement("beforebegin", sidebar);
    if (discussion.classList.contains("discussion")) {
      discussion.querySelector("h3").innerHTML="Discussion";
      sidebar.insertAdjacentElement("afterbegin",$("<h4>Who you're mentoring</h4>"));
    } else {
      sidebar.insertAdjacentElement("afterbegin",$("<h4>Who you'll be mentoring</h4>"));
    }
  }
}

const addNewSolutionsMenuLink = () => {
  let dashboard = document.querySelector('.dropdown a[href*="/mentor/dashboard"]');
  dashboard.insertAdjacentElement('afterend',
    $("<li><a href='/mentor/dashboard/next_solutions'>Queue</a></li>"));
};

const PRIVATE_URL_RE = /exercism\.io\/solutions\/([a-z0-9]+$)/;
const NOT_PUBLIC_TEXT = "solution is not public";

const redirectToMentoringURL = () => {
  let m = window.location.href.match(PRIVATE_URL_RE);
  if (m && document.body.innerHTML.includes(NOT_PUBLIC_TEXT)) {
    redirect(`/mentor/solutions/${m[1]}`);
  }
};

document.addEventListener("keyup", (ev) => {
  console.log(ev);
});

const boot = async () => {
  redirectToMentoringURL();
  cleanerUI();
  addNewSolutionsMenuLink();

  if (getEditor()) {
    if (onMacintosh())
      fixEditorKeystrokes();
    editorTips();
  }

  new MentorSolutionView().render();

  // fetch("https://exercism.io/my/notifications")
  //   .then((resp) => resp.blob())
  //   .then((blob) => blob.text())
  //   .then((text) => console.log(text))

};

document.addEventListener("DOMContentLoaded", () => {
  boot();
});
