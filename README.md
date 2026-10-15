## Abdullah Azmi

### Computational Genomics & Agentic Systems (CGAS) Lab · Northwestern University (CS & NICO)

[![Portfolio](https://img.shields.io/badge/Portfolio-abdullahazmi.com-5B6437?style=flat-square)](https://abdullahazmi.com/)
[![CGAS Lab](https://img.shields.io/badge/Research_Lab-abdullahazmi.com%2Flab-3A2A1C?style=flat-square)](https://abdullahazmi.com/lab/)
[![Workbench](https://img.shields.io/badge/Interactive_Workbench-4_Live_Simulations-2E4057?style=flat-square)](https://abdullahazmi.com/#workbench)
[![CV / Resume](https://img.shields.io/badge/CV_%2F_Resume-PDF-4A5568?style=flat-square)](https://abdullahazmi.com/assets/abdullah-azmi-resume.pdf)
[![ORCID](https://img.shields.io/badge/ORCID-0009--0004--8172--6394-A6CE39?style=flat-square&logo=orcid)](https://orcid.org/0009-0004-8172-6394)

- **Affiliations:** Department of Computer Science & Northwestern Institute on Complex Systems (NICO), McCormick School of Engineering, Northwestern University (Evanston, IL & New York, NY)
- **Research & Engineering Focus:** Scientific Knowledge Graphs & Multi-Agent Verification, Regulatory Genomics & Non-Coding Variant Attribution, Calibrated Bayesian State-Space Inference, and High-Reliability Distributed Full-Stack Systems

---

### I. CGAS Lab Flagship Scientific Software (`github.com/aazminu`)

| Repository | Domain | Architecture & Empirical Benchmarks |
| :--- | :--- | :--- |
| **[`aazminu/paper-pulse`](https://github.com/aazminu/paper-pulse)** | Autonomous Scientific Knowledge Graphs | Nightly ingestion across **ArXiv, Semantic Scholar, PubMed & OpenAlex**; hybrid **PostgreSQL (`pgvector`)** dense retrieval + **Neo4j** multi-hop citation-concept property graph; deterministic claim provenance & daily audio synthesis. |
| **[`aazminu/chrom-alphagenome`](https://github.com/aazminu/chrom-alphagenome)** | Regulatory Genomics & Variant Attribution | Integrates **AlphaGenome Atlas** 3D cis-regulatory tracks, base-resolution **ChromBPNet / DeepLIFT** $\lvert\Delta\log_2\text{ATAC}\rvert$ footprints, and **MaxEntScan** splice-junction $\Delta\text{PSI}$ modeling across ClinVar, gnomAD v4 & ENCODE v4 cCREs (**0.941 AUROC**). |
| **[`aazminu/bayes-kalman-trace`](https://github.com/aazminu/bayes-kalman-trace)** | Recursive Bayesian State-Space Inference | Constant-acceleration **Kalman Filter** + **Rauch–Tung–Striebel (RTS)** smoother across **500-sample** noisy velocity trajectories with analytic missing-data marginalization and **log-linear pooling** over 250K measurements (**93.8% accuracy, 0.041 ECE**). |
| **[`aazminu/fold-energetics-xtb`](https://github.com/aazminu/fold-energetics-xtb)** | Structural Pocket Partitioning & QM Triage | **AlphaFold 3** `pLDDT` filtration and **PAE** spectral domain partitioning, **Foldseek 3Di** structural homology search, and semiempirical tight-binding quantum mechanics (**GFN2-xTB**) coupled with **ChEMBL (`pChEMBL`)** bioactivity priors. |

---

### II. Production Full-Stack, Data Operations & Open-Source Platforms (`github.com/aazminu`)

| Repository | Role & Scope | Technical Highlights & Verification |
| :--- | :--- | :--- |
| **[`aazminu/airtight-container`](https://github.com/aazminu/airtight-container)** | Full-Stack Yard Inventory & Billing Platform | **React 18, TypeScript, Node.js/Express, PostgreSQL, AWS EC2 (40K+ LOC, 25 migrations, 275+ automated tests)**. Implements idempotent month-end storage-and-handling proration (`buildLinesForBox`, `generateShMonthEnd`) with composite transactional locks across 240+ yard assets. |
| **[`aazminu/LeadAI`](https://github.com/aazminu/LeadAI)** | Async Entity Enrichment & Qualification Queue | **Python, FastAPI, Bounded Async Queue (`pipeline_queue.py`), PostgreSQL**. Multi-source company research, rate-limited token buckets, exponential-backoff retry recovery, and schema-validated structured LLM extraction. |
| **[`aazminu/odyssey`](https://github.com/aazminu/odyssey)** | University Learning Platform (Next.js / Strapi) | Repaired recursive AST block conversion so deeply indented MDX lesson paragraphs and headings render accurately in live author previews; eliminated embedded code-editor reload flicker; shipped multilevel **Jest** regression suites. |
| **[`aazminu/mermaid`](https://github.com/aazminu/mermaid)** | Declarative Diagramming & Charting Engine | Engineered configurable inner/outer data-value labels for SVG bar charts across horizontal and vertical orientations and refined journey-diagram text formatting with **Vitest & Cypress** visual regression coverage. |
| **[`aazminu/FarmData2`](https://github.com/aazminu/FarmData2)** | Operational Recordkeeping Platform | Built transactional **Node.js / Vue.js / PostgreSQL** operational recordkeeping APIs, containerized **Docker** dev workflows, and deterministic **Cypress** end-to-end integration test suites. |

---

### III. Systems Architecture, Distributed Data & Applied ML Suite ([Full 16-System Catalog](https://github.com/aazminu/abdullahazmi.com/blob/main/PROFILE_PLAN.md))

- **[ScrubData — Distributed Tabular Cleaning Engine](https://github.com/aazminu/abdullahazmi.com/blob/main/PROFILE_PLAN.md#10-scrubdata--distributed-tabular-cleaning-engine):** Automated schema inference, composite key deduplication, Z-score/IQR anomaly isolation, and exception manifest generation over 100K+ row CSV/Parquet datasets (`Python`, `Node.js`, `PostgreSQL`, `Apache Spark / Databricks`, `AWS S3`).
- **[Cycle-Accurate RISC-V (`RV32I`) 5-Stage Pipelined Simulator](https://github.com/aazminu/abdullahazmi.com/blob/main/PROFILE_PLAN.md#11-cycle-accurate-risc-v-rv32i-pipelined-simulator):** Bit-accurate single-cycle and 5-stage pipelined (`IF, ID, EX, MEM, WB`) RV32I processor simulator in `Python/C` with `EX/MEM` and `MEM/WB` RAW hazard forwarding, load-use stall bubble injection, and golden-trace verification.
- **[Market-Scale Dividend Capture & Streaming Alpha](https://github.com/aazminu/abdullahazmi.com/blob/main/PROFILE_PLAN.md#12-market-scale-dividend-capture--streaming-alpha):** Distributed `Spark / HDFS` backtesting over 165K+ historical dividend declarations and 5 years of US equity bars paired with calibrated Gradient-Boosted Tree (GBT) classifiers and `Kafka Structured Streaming`.
- **[Low-Rank SVD World-Model Compression (`LeWM`)](https://github.com/aazminu/abdullahazmi.com/blob/main/PROFILE_PLAN.md#13-low-rank-svd-world-model-compression-lewm):** Post-training uniform and activation-aware SVD spectral truncation of latent world models for Cross-Entropy Method (CEM) Model Predictive Control on `TwoRoom` and `PushT` (**>96% planning reward at 45% compression, 1.72× rollout speedup**).
- **[Adaptive Real-Time ML Moderation & Drift Engine](https://github.com/aazminu/abdullahazmi.com/blob/main/PROFILE_PLAN.md#14-adaptive-real-time-ml-moderation--drift-engine):** Sub-150ms p95 streaming toxicity inference combining fine-tuned `DistilBERT` and calibrated TF-IDF cascades over 160K+ labeled records with `MinIO` artifact versioning and active learning.
- **[Multi-Service ChatOps Workflow & Incident Bot](https://github.com/aazminu/abdullahazmi.com/blob/main/PROFILE_PLAN.md#15-multi-service-chatops-workflow--incident-bot):** Event-driven `Python / FastAPI / Slack` integration bridging GitHub Actions, issue queues, and incident workflows with idempotent webhook deduplication (**95% reduction in manual triage latency**).
- **[Real-Time WebSocket Group Recommender & Matrix Factorization](https://github.com/aazminu/abdullahazmi.com/blob/main/PROFILE_PLAN.md#16-real-time-websocket-group-recommender--matrix-factorization):** Multi-user `PyTorch` neural collaborative filtering and Pareto-fair group utility aggregation streaming live consensus rankings across concurrent `FastAPI WebSocket` rooms (`<200ms` latency).

---

### Technical Stack

**Languages & Systems:**  
![Python](https://img.shields.io/badge/-Python_3.11+-000?&logo=python)
![TypeScript](https://img.shields.io/badge/-TypeScript-000?&logo=typescript)
![SQL](https://img.shields.io/badge/-PostgreSQL_%2F_SQL-000?&logo=postgresql)
![C++](https://img.shields.io/badge/-C_%2F_C++-000?&logo=cplusplus)
![Rust](https://img.shields.io/badge/-Rust-000?&logo=rust)
![RISC-V](https://img.shields.io/badge/-RISC--V_RV32I-000?&logo=riscv)

**AI, Bioinformatics, Web & Data Infrastructure:**  
![PyTorch](https://img.shields.io/badge/-PyTorch-000?&logo=pytorch)
![FastAPI](https://img.shields.io/badge/-FastAPI-000?&logo=fastapi)
![React](https://img.shields.io/badge/-React_18_%2F_Next.js_14-000?&logo=react)
![Node.js](https://img.shields.io/badge/-Node.js_%2F_Express-000?&logo=nodedotjs)
![PostgreSQL](https://img.shields.io/badge/-pgvector-000?&logo=postgresql)
![Neo4j](https://img.shields.io/badge/-Neo4j-000?&logo=neo4j)
![Apache Spark](https://img.shields.io/badge/-Spark_%2F_Kafka-000?&logo=apachespark)
![Docker](https://img.shields.io/badge/-Docker_%2F_AWS-000?&logo=docker)

---

### Contact & Verification
- **Main Portfolio & Interactive Workbench:** [https://abdullahazmi.com/](https://abdullahazmi.com/)
- **CGAS Lab Portal:** [https://abdullahazmi.com/lab/](https://abdullahazmi.com/lab/)
- **Academic Email:** [m4u5t4@u.northwestern.edu](mailto:m4u5t4@u.northwestern.edu) · **Direct:** [erlokix@gmail.com](mailto:erlokix@gmail.com)
- **ORCID:** [0009-0004-8172-6394](https://orcid.org/0009-0004-8172-6394)
