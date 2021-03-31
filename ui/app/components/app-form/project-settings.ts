import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import ApiService from 'waypoint/services/api';
import FlashMessagesService from 'waypoint/services/flash-messages';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Project, UpsertProjectRequest, Job, Application } from 'waypoint-pb';
import parseUrl from 'parse-url';

class ProjectModel {
  name: string;
  applicationsList: [];
  dataSource: {
    git: {
      url: string,
      path: string,
      ref: string,
      basic: {
        username: string,
        password: string,
      },
      ssh: {
        user: string,
        password: string,
        privateKeyPem: string
      }
    },
    local:any,
  };
  dataSourcePoll: {
    enabled: boolean,
    interval: string,
  };
  remoteEnabled: boolean;
}

const DEFAULT_PROJECT_MODEL = {
  name: '',
  applicationsList: [],
  dataSource: {
    git: {
      url: '',
      path: '',
      ref: '',
      basic: {
        username: '',
        password: ''
      },
      ssh: {
        user: '',
        password: '',
        privateKeyPem: '',
      }
    },
    local: null,
  },
  dataSourcePoll: {
    enabled: false,
    interval: '2m',
  },
  remoteEnabled: null,
};

interface ProjectSettingsArgs {
  project: ProjectModel
}

export default class AppFormProjectSettings extends Component<ProjectSettingsArgs> {
  // normal class body definition here
  @service api!: ApiService;
  @service flashMessages!: FlashMessagesService;
  @service router!: RouterService;
  @tracked project: ProjectModel;
  @tracked authCase: number;

  constructor(owner: any, args: any) {
    super(owner, args);
    let { project } = this.args;
    this.project = project;
    if (this.project?.dataSource?.git) {
      // Set authCase if it exists
      if (project.dataSource?.git?.ssh?.privateKeyPem) {
        this.authCase = 5;
      } else {
        this.authCase = 4;
        // Set empty default git basic auth if not defined
        if (!this.project?.dataSource?.git?.basic?.username) {
          this.project.dataSource.git.basic = DEFAULT_PROJECT_MODEL.dataSource.git.basic;
          this.project.dataSource.git.ssh = DEFAULT_PROJECT_MODEL.dataSource.git.ssh;
        }
      }
      this.authCase = project.dataSource?.git?.ssh?.privateKeyPem ? 5 : 4;
    } else {
      // set empty default dataSource data if non-existent
      this.project.dataSource = DEFAULT_PROJECT_MODEL.dataSource
      this.authCase = 4;
    }

    if (!this.project?.dataSourcePoll) {
      this.project.dataSourcePoll = DEFAULT_PROJECT_MODEL.dataSourcePoll;
    }
  }

  get dataSource(){
    return this.project.dataSource;
  }

  get authSSH() {
    return this.authCase === 5;
  }

  get authBasic() {
    return this.authCase === 4;
  }

  get git() {
    return this.dataSource?.git;
  }


  validateGitUrl() {
    let gitUrl = parseUrl(this.project.dataSource.git.url);
    // If basic auth, match https url
    if (this.authCase == 4) {
      if (gitUrl.protocol != 'https') {
        this.flashMessages.error('Git url needs to use "https:" protocol');
        return false;
      }
    }
    // If ssh force users to use a git: url
    if (this.authCase == 5) {
      if (gitUrl.protocol != 'ssh') {
        this.flashMessages.error('Git url needs to use "git:" protocol');
        return false;
      }
    }
    return true;
  }

  @action
  setAuthCase(val:any) {
    this.authCase = val;
  }

  @action
  setBasicAuth(path: string, e: any) {
    if (!this.project.dataSource?.git?.basic) {
      this.project.dataSource.git.basic = {
        username: '',
        password: ''
      };
    }
    this.project.dataSource.git.basic[path] = e.target.value;
  }

  @action
  setSshAuth(path: string, e: any) {
    if (!this.project.dataSource?.git?.ssh) {
      this.project.dataSource.git.ssh = {
        user: '',
        password: '',
        privateKeyPem: '',
      };
    }
    this.project.dataSource.git.ssh[path] = e.target.value;
  }

  @action
  async saveSettings(e: Event) {
    e.preventDefault();
    if (!this.validateGitUrl()) {
      return;
    }
    let project = this.project;
    project.dataSource = this.dataSource;
    let ref = new Project();
    ref.setName(project.name);
    let dataSource = new Job.DataSource();
    let dataSourcePoll = new Project.Poll();
    dataSourcePoll.setEnabled(project.dataSourcePoll.enabled);
    dataSourcePoll.setInterval(project.dataSourcePoll.interval);
    // Git settings
    let git = new Job.Git();
    git.setUrl(project.dataSource.git.url);
    git.setPath(project.dataSource.git.path);
    git.setRef(project.dataSource.git.ref);

    // Git Authentication settings
    if (this.authBasic) {
      let gitBasic = new Job.Git.Basic();
      gitBasic.setUsername(this.git.basic.username);
      gitBasic.setPassword(this.git.basic.password);
      git.setBasic(gitBasic);
      git.clearSsh();
    }

    if (this.authSSH) {
      let gitSSH = new Job.Git.SSH();
      let encoder = new window.TextEncoder();
      gitSSH.setPrivateKeyPem(encoder.encode(this.git.ssh.privateKeyPem));
      gitSSH.setUser(this.git.ssh.user);
      gitSSH.setPassword(this.git.ssh.password);
      git.setSsh(gitSSH);
      git.clearBasic();
    }

    dataSource.setGit(git);
    ref.setDataSource(dataSource);
    ref.setDataSourcePoll(dataSourcePoll);
    let applist = project.applicationsList.map((app: Application.AsObject) => {
      return new Application(app);
    });
    ref.setApplicationsList(applist);
    let req = new UpsertProjectRequest();
    req.setProject(ref);
    try {
      await this.api.client.upsertProject(req, this.api.WithMeta());
      this.flashMessages.success('Settings saved');
      this.router.transitionTo('workspace.projects.project', this.project.name);
    } catch (err) {
      this.flashMessages.error('Failed to save Settings', { content: err.message, sticky: true });
    }
  }
}
